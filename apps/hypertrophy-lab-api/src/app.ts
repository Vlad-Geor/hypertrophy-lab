import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

import { hydrateUser } from './repositories/users.repo.js';
import { registerRoutes } from './routes/register-routes.js';

export const app: Application = express();

/* core middleware */
app.use(express.json());
app.use(cookieParser());

/* request log BEFORE anything else */
app.use((req, _res, next) => {
  const authHeader = req.headers.authorization || '(none)';
  console.log(
    '[REQ]',
    req.method,
    req.originalUrl,
    'auth:',
    authHeader.slice(0, 80),
  );
  next();
});

/* public health BEFORE auth */
app.get('/health', (req, res) => {
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

/* wrap auth so we see why it fails */
function checkJwtWithLog(req, res, next) {
  console.log('[AUTH] checking', req.method, req.originalUrl);
  console.log('[AUTH] header:', req.headers.authorization || '(none)');
  checkJwt(req, res, (err) => {
    if (err) {
      console.error('[AUTH] error:', err.name, err.message);
      return next(err);
    }
    console.log('[AUTH] ok sub=', req.auth?.payload?.sub);
    next();
  });
}

/* protected pipeline */
app.use(checkJwtWithLog);
app.use(hydrateUser);

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
    return res
      .status(401)
      .json({ error: 'unauthorized', detail: err.message });
  }

  return res
    .status(status || 500)
    .json({ error: 'server_error', detail: err.message });
});

/* 404 catch-all LAST */
app.use((req, res) => {
  console.warn('[404]', req.method, req.originalUrl);
  res.status(404).json({ error: 'not_found' });
});
