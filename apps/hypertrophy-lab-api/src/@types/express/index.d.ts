import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { uid: number; iat: number; exp: number }; // shape you store
  }
}
