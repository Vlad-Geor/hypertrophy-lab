import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';

import { registerRoutes } from './routes/register-routes';

export const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

registerRoutes(app);
