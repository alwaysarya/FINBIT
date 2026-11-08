import { Router } from 'express';
import { createTransfer } from '../controllers/transfer.controller';
const router = Router();
router.post('/', createTransfer);
export default router;
