import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const imagesDir = join(process.cwd(), 'assets', 'images');
const outputFile = join(process.cwd(), 'site-data.js');

const validExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      const dot = entry.name.lastIndexOf('.');
      if (dot === -1 || !validExtensions.has(entry.name.slice(dot).toLowerCase())) {
        return [];
      }
      return [relative(process.cwd(), fullPath).replaceAll('\\', '/')];
    }),
  );

  return nested.flat();
}

const images = (await walk(imagesDir))
  .filter((path) => path.includes('/posts/'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

await writeFile(outputFile, `window.__SEVENTHRELIC__ = ${JSON.stringify({ images }, null, 2)};\n`);
