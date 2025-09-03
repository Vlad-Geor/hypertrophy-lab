import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

import { loadEnv } from './config/env';
import { registerRoutes } from './routes/register-routes';

export const app: Application = express();

const env = loadEnv();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'https://32d598607f67.ngrok-free.app',
  'http://localhost:4200',
  'https://hypertrophy-lab.vercel.app',
];

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
  checkJwt,
);

registerRoutes(app);
