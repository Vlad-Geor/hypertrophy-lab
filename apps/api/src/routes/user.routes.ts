/** @format */

import { Router } from 'express';
import { SupplementController } from '../controllers/supplement.controller';

const router = Router();

router.get('/', SupplementController.getAll);
router.get('/:id', SupplementController.getOne);
router.post('/', SupplementController.create);
router.put('/:id', SupplementController.update);
router.delete('/:id', SupplementController.delete);

export default router;
