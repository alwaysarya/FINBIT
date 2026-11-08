import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
// Now requires valid token
router.get('/:userId', requireAuth, getDashboardStats);

export default router;
