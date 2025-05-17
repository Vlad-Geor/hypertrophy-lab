import { Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

const apiRouter = Router();

// Path to routes directory
const routesPath = join(__dirname);

readdirSync(routesPath)
  .filter((file) => {
    return file.endsWith('.routes.js') && file !== 'api.routes.js';
  })
  .forEach((file) => {
    console.log(`Loading router: ${file}`);
    const route = require(`./${file}`);
    const router = route.default;

    if (!router) {
      throw new Error(`❌ Missing default export in ${file}`);
    }

    if (typeof router !== 'function' || typeof router.use !== 'function') {
      throw new Error(`❌ Default export in ${file} is not a valid Express Router`);
    }

    const routeBase = file.replace('.routes.js', '');

    apiRouter.use(`/${routeBase.replace('.routes', '')}`, router);
  });

apiRouter.get('/health', (_req, res) => {
  res.send('API is healthy!');
});

export default apiRouter;
