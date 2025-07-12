import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';

import { registerRoutes } from './routes/register-routes';

export const app: Application = express();

app.use(express.json());
app.use(cookieParser());

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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

registerRoutes(app);
