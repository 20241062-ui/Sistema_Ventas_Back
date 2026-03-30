import express from 'express';
import { agregarAlCarrito, getCarrito, eliminarDelCarrito } from '../controllers/carritoController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Ajusta según tu proyecto

const router = express.Router();

router.use(verifyToken); 

router.get('/', getCarrito);
router.post('/', agregarAlCarrito);
router.delete('/:id', eliminarDelCarrito);

export default router;