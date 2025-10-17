import { Router } from 'express';
import * as manifest from './manifest';

const api = Router();
for (const [base, router] of Object.entries(manifest)) {
  if (!(router as any)?.use) throw new Error(`Not an Express Router: ${base}`);
  api.use(`/${base.replace(/\.routes$/, '')}`, router as any);
}

api.get('/health', (_req, res) => res.send('API is healthy!'));
export default api;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const apiRouter = Router();
// const routesPath = join(__dirname);

// for (const file of readdirSync(routesPath)) {
//   console.log(file);

//   if (!file.endsWith('.routes.js') || file === 'api.routes.js') continue;

//   console.log(`Loading router: ${basename(file, '.js')}`);

//   // const modPath = join(routesPath, file);
//   // const mod = require(modPath);
//   // const router = mod.default ?? mod;

//   const mod = await import(pathToFileURL(join(routesPath, file)).href);
//   const router = mod.default ?? mod.router ?? mod;

//   if (!router?.use) throw new Error(`❌ Not an Express Router: ${file}`);

//   const base = file.replace('.routes.js', '').replace('.routes', '');
//   console.log('using route: ', base);

//   apiRouter.use(`/${base}`, router);
// }

// apiRouter.get('/health', (_req, res) => res.send('API is healthy!'));
// export default apiRouter;
