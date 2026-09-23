import test from 'node:test';
import assert from 'node:assert/strict';
import { canCache, isUsable, resolveReading, MAX_AGE_MS } from './policy.mjs';
const now = Date.parse('2026-01-01T12:00:00Z');
const reading = { temperature: 72, recordedAt: new Date(now - 1000).toISOString() };
const fail = async () => { throw new Error('unavailable'); };
test('cache allowlist rejects writes, other routes and foreign origins', () => {
  const origin = 'https://example.test';
  assert.equal(canCache(new URL('/api/demo-reading', origin), 'GET', origin), true);
  for (const [url, method] of [['/api/demo-reading','POST'], ['/api/private','GET'], ['https://other.test/api/demo-reading','GET']]) assert.equal(canCache(new URL(url, origin), method, origin), false);
});
test('reading age rejects invalid, future and expired data', () => {
  for (const recordedAt of ['invalid', new Date(now + 1).toISOString(), new Date(now - MAX_AGE_MS - 1).toISOString()]) assert.equal(isUsable({ ...reading, recordedAt }, now), false);
  assert.equal(isUsable({ ...reading, temperature: NaN }, now), false);
  assert.equal(isUsable({ ...reading, recordedAt: new Date(now - MAX_AGE_MS).toISOString() }, now), true);
});
test('successful network response survives cache write failure', async () => {
  assert.deepEqual(await resolveReading({ network: async () => reading, saved: fail, save: fail, now }), { reading, source: 'network' });
});
test('offline fallback is labeled saved, never fresh', async () => {
  assert.deepEqual(await resolveReading({ network: fail, saved: async () => reading, save: fail, now }), { reading, source: 'saved' });
});
test('expired or inaccessible fallback returns unavailable', async () => {
  for (const saved of [fail, async () => ({ ...reading, recordedAt: '2020-01-01' })]) assert.deepEqual(await resolveReading({ network: fail, saved, save: fail, now }), { reading: null, source: 'unavailable' });
});
test('invalid network result does not replace usable saved data', async () => {
  let wrote = false;
  assert.equal((await resolveReading({ network: async () => ({}), saved: async () => reading, save: async () => { wrote = true; }, now })).source, 'saved');
  assert.equal(wrote, false);
});
test('default clock validates at response time, after network latency', async () => {
  const result = await resolveReading({
    network: async () => {
      await new Promise(resolve => setTimeout(resolve, 20));
      return { temperature: 72, recordedAt: new Date().toISOString() };
    }, saved: fail, save: async () => {},
  });
  assert.equal(result.source, 'network');
});
