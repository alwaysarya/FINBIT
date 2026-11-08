import { Router } from 'express';
import { getBeneficiaries, addBeneficiary, deleteBeneficiary } from '../controllers/beneficiary.controller';

const router = Router();
router.get('/:userId', getBeneficiaries);
router.post('/', addBeneficiary);
router.delete('/:id', deleteBeneficiary);

export default router;
