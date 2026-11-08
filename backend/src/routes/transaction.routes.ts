import { Router } from 'express';
import { getTransactions } from '../controllers/transaction.controller';
const router = Router();
router.get('/:userId', getTransactions);
export default router;
