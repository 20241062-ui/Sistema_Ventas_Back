import express from 'express';
import { procesarCompra } from '../controllers/pedidoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/checkout', verificarToken, procesarCompra);
export default router;