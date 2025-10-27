import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

import { buildWebhookHandler, setWebhook } from '@ikigaidev/tg-bot';
import { loadEnv } from './config/env.js';
import { createBot } from './infra/create-bot.js';
import { hydrateUser } from './repositories/users.repo.js';
import { registerRoutes } from './routes/register-routes.js';

export const app: Application = express();
const env = loadEnv();
const bot = await createBot(env);

/* core middleware */
app.use(express.json());
app.use(cookieParser());

const hook = `/telegram/${env.TG_WEBHOOK_SECRET}`;
app.get('/telegram/set-webhook', async (_req, res) => {
  const url = env.TG_PUBLIC_URL + hook;
  res.json(
    await setWebhook({ token: env.TG_BOT_TOKEN, url, secret: env.TG_WEBHOOK_SECRET }),
  );
});

app.post(
  hook,
  (req, res, next) =>
    req.get('X-Telegram-Bot-Api-Secret-Token') === env.TG_WEBHOOK_SECRET
      ? next()
      : res.sendStatus(401),
  express.json(),
  buildWebhookHandler(bot),
);

/* request log BEFORE anything else */
app.use((req, _res, next) => {
  const authHeader = req.headers.authorization || '(none)';
  console.log('[REQ]', req.method, req.originalUrl, 'auth:', authHeader.slice(0, 80));
  next();
});

/* public health BEFORE auth */
app.get('/health', (_req, res) => {
  console.log('[HEALTH] hit /health');
  res.send('ok');
});

/* cors */
const allowedOrigins = [
  'https://32d598607f67.ngrok-free.app',
  'http://localhost:4200',
  'https://hypertrophy-lab.vercel.app',
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/* auth setup */
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});

app.get('/', (_req, res) => {
  res.status(200).send('api up');
});

/* wrap auth so we see why it fails */
function checkJwtWithLog(req, res, next) {
  checkJwt(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
}

/* protected pipeline */
// app.use(checkJwtWithLog);
app.use('/api/v1', checkJwtWithLog, hydrateUser);

// app.use(hydrateUser);

/* routes */
registerRoutes(app);

/* error handler AFTER routes */
app.use((err, req, res, _next) => {
  console.error('[ERR]', req.method, req.originalUrl, err);

  // express-oauth2-jwt-bearer usually sets status on err
  const status = err.status || err.statusCode;

  if (err.name === 'InvalidRequestError') {
    return res
      .status(status || 400)
      .json({ error: 'invalid_request', detail: err.message });
  }

  if (err.name === 'UnauthorizedError' || (status && status === 401)) {
    return res.status(401).json({ error: 'unauthorized', detail: err.message });
  }

  return res.status(status || 500).json({ error: 'server_error', detail: err.message });
});

/* 404 catch-all LAST */
app.use((req, res) => {
  console.warn('[404]', req.method, req.originalUrl);
  res.status(404).json({ error: 'not_found' });
});
