import { Router } from 'express';
import { getCards, toggleFreeze } from '../controllers/card.controller';
const router = Router();
router.get('/:userId', getCards);
router.patch('/:cardId/freeze', toggleFreeze);
export default router;
