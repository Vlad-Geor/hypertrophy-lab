/** @format */

import { Router } from 'express';
import * as ctl from '../controllers/users.controller.js';

const r = Router();

r.get('/', ctl.list);
r.get('/:id', ctl.getOne);
r.put('/:id', ctl.update);
r.delete('/:id', ctl.remove);

export default r;
