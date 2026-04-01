import express from 'express';
import { obtenerCarrito, agregarAlCarrito, eliminarDelCarrito } from '../controllers/carritoController.js';
import { verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarAdmin);

router.get('/', obtenerCarrito);
router.post('/agregar', agregarAlCarrito);
router.delete('/:id', eliminarDelCarrito);

export default router;