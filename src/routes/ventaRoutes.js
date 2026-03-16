import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
import {obtenerVentas,obtenerDetalleVenta} from '../controllers/ventaController.js';

const router = express.Router();

router.get('/', verificarAdmin, obtenerVentas);
router.get('/:id', verificarAdmin, obtenerDetalleVenta);

export default router;