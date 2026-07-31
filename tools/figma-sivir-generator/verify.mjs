import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '../..');
const source = fs.readFileSync(path.join(here, 'bundle.js'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'apps/docs/src/lib/components.ts'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(here, 'manifest-complete.json'), 'utf8'));
const state = JSON.parse(fs.readFileSync(path.join(here, 'build-state.json'), 'utf8'));

const title = (slug) => slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
const publicNames = [...catalog.matchAll(/^\s*'([^']+)',?$/gm)].map((match) => title(match[1]));
const namesBlock = source.match(/const NAMES = \[([\s\S]*?)\];/);
if (!namesBlock) throw new Error('NAMES inventory is missing');
const generatedNames = [...namesBlock[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);

const missing = publicNames.filter((name) => !generatedNames.includes(name));
const extra = generatedNames.filter((name) => !publicNames.includes(name));
if (publicNames.length !== 50) throw new Error(`Expected 50 public components, found ${publicNames.length}`);
if (generatedNames.length !== 50) throw new Error(`Expected 50 generated components, found ${generatedNames.length}`);
if (missing.length || extra.length) throw new Error(`Inventory mismatch: missing=${missing.join(',')} extra=${extra.join(',')}`);

for (const screen of ['01 · Agent Fleet', '02 · Live Run', '03 · Run Detail']) {
  if (!source.includes(screen)) throw new Error(`Missing example screen: ${screen}`);
}
for (const collection of ['Color Primitives', 'Color', 'Spacing & Size', 'Radius & Border', 'Typography', 'Motion']) {
  if (!source.includes(`collection('${collection}')`)) throw new Error(`Missing collection: ${collection}`);
}
for (const style of ['Sivir/Header', 'Sivir/Body', 'Sivir/Label', 'Sivir/Button', 'Sivir/Badge', 'Sivir/Code']) {
  if (!source.includes(style)) throw new Error(`Missing text style: ${style}`);
}
if (manifest.main !== 'bundle.js') throw new Error('Complete manifest does not target bundle.js');
if (state.fallback.expectedComponents !== 50 || state.fallback.expectedExampleScreens !== 3) throw new Error('Build state expectations are stale');

console.log(JSON.stringify({
  publicComponents: publicNames.length,
  generatedComponents: generatedNames.length,
  exampleScreens: 3,
  collections: 6,
  textStyles: 6,
  manifestMain: manifest.main
}, null, 2));
