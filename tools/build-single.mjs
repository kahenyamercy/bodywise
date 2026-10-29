// Builds single-file versions of BodyWise (no server needed):
//   dist/bodywise.html  — open by double-clicking, or host anywhere as one file
//   dist/artifact.html  — the same page without the outer html/head/body tags (for hosts that add their own)
// Run: node tools/build-single.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const read = (p) => readFileSync(path.join(root, p), 'utf8');

let out = html
  .replace(/<link rel="stylesheet" href="css\/styles.css">/, () => '<style>\n' + read('css/styles.css') + '\n</style>')
  .replace(/<script src="([^"]+)"><\/script>/g, (_, src) => '<script>\n' + read(src).replace(/<\/script/gi, '<\\/script') + '\n</script>')
  .replace(/<link rel="manifest"[^>]*>\n?/, '')
  .replace(/<link rel="icon"[^>]*>\n?/, '');

mkdirSync(path.join(root, 'dist'), { recursive: true });
writeFileSync(path.join(root, 'dist/bodywise.html'), out);

const head = out.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\n?/, '').replace(/<meta name="viewport"[^>]*>\n?/, '');
const body = out.match(/<body>([\s\S]*?)<\/body>/)[1];
const title = head.match(/<title>.*?<\/title>\n?/)[0];
writeFileSync(path.join(root, 'dist/artifact.html'), title + head.replace(title, '') + body);
console.log('Built dist/bodywise.html and dist/artifact.html (' + Math.round(out.length / 1024) + ' KB)');
