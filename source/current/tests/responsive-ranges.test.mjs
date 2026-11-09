import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const boundaries = new Set([320, 360, 480, 640, 960, 1200]);
async function sources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory()
    ? sources(path.join(dir, entry.name))
    : /\.(css|jsx?|html)$/.test(entry.name) ? [path.join(dir, entry.name)] : []));
  return groups.flat();
}

test('all viewport-width conditions use only the owner-approved range boundaries', async () => {
  const files = await sources(path.join(root, 'src'));
  let count = 0;
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const queries = [
      ...[...text.matchAll(/@media\s*([^{}]+)\{/g)].map(match => match[1]),
      ...[...text.matchAll(/matchMedia\(\s*['"]([^'"]+)['"]/g)].map(match => match[1]),
    ];
    assert.doesNotMatch(text, /@container[^{}]*(?:width|inline-size)/, file);
    for (const query of queries.filter(query => /width/.test(query))) {
      const parts = query.split(/\s+and\s+/);
      for (const part of parts) {
        const match = /^\(width\s*(<|>=)\s*(\d+)px\)$/.exec(part.trim());
        assert.ok(match, `${file}: unsupported width condition ${part}`);
        assert.ok(boundaries.has(Number(match[2])), `${file}: unexpected boundary ${match[2]}`);
        count++;
      }
    }
  }
  assert.ok(count > 0, 'The scan must find the actual responsive rules.');
});

// Miro's former gesture mode was removed by the owner's automatic-only decision.
// Actual shell containment, image fit and absence of interactive controls are
// checked in the browser regression matrix, rather than requiring obsolete JS.
