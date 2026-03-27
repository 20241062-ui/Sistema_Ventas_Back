import express from 'express';
const router = express.Router();
import { getSimulacionDinamica } from '../controllers/analisisController.js';

router.get('/simulacion/:noSerie', getSimulacionDinamica);

export default router;