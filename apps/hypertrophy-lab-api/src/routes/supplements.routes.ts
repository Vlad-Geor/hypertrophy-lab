/** @format */

import { Router } from 'express';
import * as brands from '../controllers/brand.controller';
import * as ctl from '../controllers/supplements.controller';
import * as targets from '../controllers/target.controller';

const r = Router();

r.get('/', ctl.listCatalog);
r.get('/:id', ctl.getCatalogById);
r.post('/', ctl.createCatalog);

r.get('/targets', targets.listTargets);
r.post('/targets', targets.createTarget);

r.get('/brands', brands.listBrands);
r.post('/brands', brands.createBrand);

export default r;
//
