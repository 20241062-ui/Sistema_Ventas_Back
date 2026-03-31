import express from 'express';
import { obtenerCarrito, agregarAlCarrito, eliminarDelCarrito } from '../controllers/carritoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODAS las rutas de carrito SÍ requieren token
router.use(verificarToken);

router.get('/', obtenerCarrito);
router.post('/agregar', agregarAlCarrito);
router.delete('/:id', eliminarDelCarrito);

export default router;