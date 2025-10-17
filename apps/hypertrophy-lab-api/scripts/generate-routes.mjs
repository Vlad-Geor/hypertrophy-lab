import { readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const routesDir = join(process.cwd(), 'apps/hypertrophy-lab-api/src/routes');
const files = readdirSync(routesDir).filter(
  (f) => /\.routes\.ts$/.test(f) && f !== 'api.routes.ts',
);

const lines = files.map((f) => {
  const base = basename(f).replace(/\.routes\.ts$/, '');
  return `export { default as ${base} } from './${base}.routes';`;
});

const out = `// AUTO-GENERATED. DO NOT EDIT.
${lines.join('\n')}
`;
writeFileSync(join(routesDir, 'manifest.ts'), out);
console.log('Generated routes manifest with', files.length, 'entries');
