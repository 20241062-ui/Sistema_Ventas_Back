import express from 'express';
const router = express.Router();
import { getSimulacionDinamica } from '../controllers/analisisController.js';

router.get('/simulacion', getSimulacionDinamica);

export default router;