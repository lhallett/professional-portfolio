import type { APIRoute } from 'astro';
import { readFile, readdir } from 'node:fs/promises';
const root = new URL('../../../../library/', import.meta.url);
export async function getStaticPaths() {
  const entries = await readdir(root, { withFileTypes: true });
  const paths = [];
  for (const entry of entries.filter(e => e.isDirectory())) {
    const directory = new URL(`${entry.name}/example/`, root);
    for (const file of await readdir(directory)) {
      if (/\.(md|mjs|js|html|svg|webmanifest|json)$/.test(file)) paths.push({ params: { path: `${entry.name}/${file}` }, props: { file: new URL(file, directory).href } });
    }
  }
  return paths;
}
export const GET: APIRoute = async ({ props }) => new Response(await readFile(new URL(props.file), 'utf8'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
