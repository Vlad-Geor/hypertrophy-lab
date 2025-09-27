import { RequestHandler } from 'express';
import { ZodType } from 'zod';

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
    req.body = parsed.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.query);
    console.log(parsed);

    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
    // coerce query to typed object (strings kept as strings unless schema transforms)
    (req as any).query = parsed.data;
    next();
  };
}
