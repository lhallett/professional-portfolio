// Only synthetic, read-only demo readings are eligible for this cache.
export const MAX_AGE_MS = 60 * 60 * 1000;
export function canCache(url, method, origin) {
  return method === 'GET' && url.origin === origin && url.pathname === '/api/demo-reading';
}
export function isUsable(reading, now = Date.now()) {
  if (!reading || typeof reading.temperature !== 'number' || !Number.isFinite(reading.temperature)) return false;
  const age = now - Date.parse(reading.recordedAt);
  // Future or expired readings are not a trustworthy fallback.
  return Number.isFinite(age) && age >= 0 && age <= MAX_AGE_MS;
}
export async function resolveReading({ network, saved, save, now }) {
  try {
    const reading = await network();
    if (!isUsable(reading, now)) throw new Error('Invalid or expired reading');
    // Storage failures must not hide a successful network response.
    try { await save(reading); } catch {}
    return { reading, source: 'network' };
  } catch {
    let reading;
    try { reading = await saved(); } catch {}
    return isUsable(reading, now)
      ? { reading, source: 'saved' }
      : { reading: null, source: 'unavailable' };
  }
}
