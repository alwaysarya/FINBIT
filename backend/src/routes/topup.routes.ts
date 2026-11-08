import { Router } from 'express';
import { topUp } from '../controllers/topup.controller';

const router = Router();
router.post('/', topUp);

export default router;
