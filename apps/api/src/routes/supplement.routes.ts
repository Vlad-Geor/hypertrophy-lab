/** @format */

import { Router } from 'express';
import { SupplementController } from '../controllers/supplement.controller';

const supplementRouter = Router();

supplementRouter.get('/', SupplementController.getAll);
supplementRouter.get('/:id', SupplementController.getOne);
supplementRouter.post('/', SupplementController.create);
supplementRouter.put('/:id', SupplementController.update);
supplementRouter.delete('/:id', SupplementController.delete);

export default supplementRouter;
