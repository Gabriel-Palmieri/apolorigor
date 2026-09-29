import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : /\.(jsx?|tsx?)$/.test(file) && !file.endsWith('.d.ts') ? [file] : [];
});
const files = walk(root);
const graph = new Map();
const errors = [];
const relative = file => path.relative(root, file).replaceAll('\\', '/');

for (const file of files) {
  const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const imports = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g)].map(match => match[1]);
  const dependencies = [];
  for (const specifier of imports.filter(value => value.startsWith('.'))) {
    const base = path.resolve(path.dirname(file), specifier);
    const target = [base, base + '.js', base + '.jsx', path.join(base, 'index.js')].find(existsSync);
    if (!target) { errors.push(`${relative(file)}: import inexistente ${specifier}`); continue; }
    if (!files.includes(target)) continue;
    dependencies.push(target);
    const from = relative(file).split('/')[0];
    const to = relative(target).split('/')[0];
    const forbidden = {
      domain: ['app', 'layouts', 'pages', 'features', 'data', 'fixtures'],
      shared: ['app', 'layouts', 'pages', 'features', 'data', 'fixtures'],
      features: ['app', 'layouts', 'pages'],
      data: ['app', 'layouts', 'pages', 'features', 'shared'],
      fixtures: ['app', 'layouts', 'pages', 'features', 'data', 'shared'],
    };
    if (forbidden[from]?.includes(to)) errors.push(`${relative(file)}: dependência de ${from} para ${to}`);
    if (from === 'domain' && relative(target).startsWith('shared/ui/')) errors.push(`${relative(file)}: domínio depende de UI`);
  }
  graph.set(file, dependencies);
}

const visited = new Set();
const active = new Set();
function visit(file, chain = []) {
  if (active.has(file)) { errors.push(`Ciclo: ${[...chain, file].map(relative).join(' → ')}`); return; }
  if (visited.has(file)) return;
  active.add(file);
  for (const dependency of graph.get(file) || []) visit(dependency, [...chain, file]);
  active.delete(file);
  visited.add(file);
}
for (const file of files) visit(file);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${files.length} módulos: imports válidos, camadas respeitadas e nenhum ciclo.`);
}
