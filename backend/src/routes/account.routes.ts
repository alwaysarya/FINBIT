import { Router } from 'express';
import { getAccounts } from '../controllers/account.controller';
const router = Router();
router.get('/:userId', getAccounts);
export default router;
