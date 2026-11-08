import { Router } from 'express';
import { getAllUsers, getUserDetails } from '../controllers/admin.controller';

const router = Router();
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);

export default router;
