import { Router } from 'express';
import { requiredScopes } from 'express-oauth2-jwt-bearer';
import * as ctrl from '../controllers/integrations.telegram.controller.js';

const router = Router();
router.post('/telegram/link', ctrl.createLinkController);
router.post(
  '/telegram/claim',
  requiredScopes('telegram:claim'),
  ctrl.claimLinkController,
);

export default router;
