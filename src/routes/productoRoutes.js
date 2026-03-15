import express from 'express';
// Usar los nombres que ahora exportamos en el controlador
import { obtenerDashboardProductos, cambiarEstadoProducto } from '../controllers/productoController.js';

const router = express.Router();

router.get('/', obtenerDashboardProductos); 
router.patch('/estado/:id', cambiarEstadoProducto);

export default router;