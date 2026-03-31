import express from 'express';
import { obtenerCarrito, agregarAlCarrito, eliminarDelCarrito } from '../controllers/carritoController.js';
import { verificarToken } from '../middleware/authMiddleware.js'; // Asegúrate de que esta ruta sea correcta

const router = express.Router();

// Todas las rutas del carrito requieren token
router.use(verificarToken);

router.get('/', obtenerCarrito);
router.post('/agregar', agregarAlCarrito);
router.delete('/:id', eliminarDelCarrito);

export default router;