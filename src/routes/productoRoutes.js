import express from 'express';
import { obtenerDashboardProductos, obtenerDetalleProducto } from '../controllers/productoController.js';

const router = express.Router();

router.get('/home', obtenerDashboardProductos); 
router.get('/detalle/:id', obtenerDetalleProducto);

export default router;