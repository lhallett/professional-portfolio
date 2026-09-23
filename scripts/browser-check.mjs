import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('/tmp/portfolio-preview', { recursive: true });
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const route of ['/', '/library/', '/library/thermostat-mobile/']) {
      await page.goto(`http://127.0.0.1:4321${route}`);
      await page.waitForLoadState('networkidle');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${route} @ ${width}`);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        assert.deepEqual(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${route} ${theme} @ ${width}`);
      }
      await page.evaluate(() => document.documentElement.dataset.theme = 'light');
      await page.screenshot({ path: `/tmp/portfolio-preview/${width}-${route.replaceAll('/', '-') || 'home'}.png`, fullPage: true });
    }
    await page.goto('http://127.0.0.1:4321/');
    await page.getByRole('button', { name: 'Switch color theme' }).click();
    const theme = await page.locator('html').getAttribute('data-theme');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.deepEqual(errors, []);
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4174');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.getByRole('button', { name: 'Refresh reading' }).click();
  await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Live response'));
  const time = await page.locator('#time').textContent();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Refresh reading' }).click();
  await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Saved reading'));
  assert.equal(await page.locator('#time').textContent(), time);
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Saved reading'));
  await page.evaluate(async () => {
    const cache = await caches.open('mobile-readings-v1');
    await cache.put('/api/demo-reading', Response.json({ temperature: 72, recordedAt: '2000-01-01T00:00:00Z' }));
  });
  await page.getByRole('button', { name: 'Refresh reading' }).click();
  await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Unavailable'));
  assert.equal(await page.locator('#temperature').textContent(), '—');
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Refresh reading' }).click();
  await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Live response'));
  await context.close();
  console.log('Browser verification passed: three pages × two widths × two themes; theme persistence; live/saved/expired/reconnected PWA states.');
} finally { await browser.close(); }
