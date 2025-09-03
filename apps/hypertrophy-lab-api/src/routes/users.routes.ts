/** @format */

import { Router } from 'express';
import { SupplementController } from '../controllers/supplements.controller';

const router = Router();

router.get('/', SupplementController.getAll);
router.get('/:id', SupplementController.getOne);
router.post('/:id/supplements', SupplementController.addUserSupplement);
router.put('/:id', SupplementController.update);
router.delete('/:id', SupplementController.delete);

export default router;
