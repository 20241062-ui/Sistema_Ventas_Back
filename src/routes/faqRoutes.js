import express from 'express';
const router = express.Router();
import { getFAQs, getFAQById, upsertFAQ, patchEstadoFAQ } from '../controllers/faqController.js';

router.get('/', getFAQs);
router.get('/:id', getFAQById);
router.post('/', upsertFAQ);
router.patch('/:id/estado', patchEstadoFAQ);

export default router;