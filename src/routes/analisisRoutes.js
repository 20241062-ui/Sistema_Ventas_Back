import express from 'express';
const router = express.Router();
import { getSimulacionStock } from '../controllers/analisisController.js';

router.get('/simulacion', getSimulacionStock);

export default router;