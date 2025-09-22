import { Router } from 'express';
import { readdirSync } from 'fs';
import { basename, join } from 'path';

const apiRouter = Router();
const routesPath = join(__dirname);

for (const file of readdirSync(routesPath)) {
  if (!file.endsWith('.routes.js') || file === 'api.routes.js') continue;

  console.log(`Loading router: ${basename(file, '.js')}`);

  const modPath = join(routesPath, file);
  const mod = require(modPath);
  const router = mod.default ?? mod;

  if (!router?.use) throw new Error(`❌ Not an Express Router: ${file}`);

  const base = file.replace('.routes.js', '').replace('.routes', '');
  apiRouter.use(`/${base}`, router);
}

apiRouter.get('/health', (_req, res) => res.send('API is healthy!'));
export default apiRouter;
