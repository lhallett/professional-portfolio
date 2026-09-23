import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']], ['/sw.js', ['sw.js', 'text/javascript']],
  ['/policy.mjs', ['policy.mjs', 'text/javascript']], ['/icon.svg', ['icon.svg', 'image/svg+xml']],
  ['/manifest.webmanifest', ['manifest.webmanifest', 'application/manifest+json']],
]);
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.writeHead(405).end(); return; }
  if (pathname === '/api/demo-reading') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ temperature: 72, recordedAt: new Date().toISOString() })); return;
  }
  const file = files.get(pathname);
  if (!file) { res.writeHead(404).end('Not found'); return; }
  try { res.setHeader('Content-Type', file[1]); res.end(await readFile(new URL(file[0], import.meta.url))); }
  catch { res.writeHead(500).end('Unable to load demo asset'); }
});
server.listen(4174, '127.0.0.1', () => console.log('Synthetic mobile example: http://127.0.0.1:4174'));
