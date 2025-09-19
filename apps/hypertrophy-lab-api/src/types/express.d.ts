import 'express';
import 'express-serve-static-core';

declare global {
  interface UserPayload {
    id: string;
    email?: string | null;
    displayName?: string | null;
    nickname?: string | null;
    pictureUrl?: string | null;
    tz: string;
    locale: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}
