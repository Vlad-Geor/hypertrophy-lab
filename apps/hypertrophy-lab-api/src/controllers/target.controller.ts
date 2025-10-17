import { RequestHandler } from 'express';
import * as svc from '../services/target.service.js';

export const createTarget: RequestHandler = async (req, res, next) => {
  try {
    const { slug, name, group, color, icon } = req.body;
    const target = await svc.createTarget({ slug, name, group, color, icon });
    res.status(201).json(target);
  } catch (err) {
    next(err);
  }
};

export const listTargets: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await svc.listTargets());
  } catch (err) {
    next(err);
  }
};
