import { RequestHandler } from 'express';
import * as svc from '../services/brand.service.js';

export const createBrand: RequestHandler = async (req, res, next) => {
  try {
    const { name, site } = req.body;
    const brand = await svc.createBrand({ name, site });
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
};

export const listBrands: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await svc.listBrands());
  } catch (err) {
    next(err);
  }
};
