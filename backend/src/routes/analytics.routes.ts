import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
const router = Router();
router.get('/:userId', getAnalytics);
export default router;
