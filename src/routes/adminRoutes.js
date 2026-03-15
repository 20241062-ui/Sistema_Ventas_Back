import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
import { 
    obtenerDashboardProductos, 
    agregarProducto, 
    actualizarProducto, 
    cambiarEstadoProducto, 
    eliminarProducto 
} from '../controllers/productoController.js';

const router = express.Router();

router.get('/productos', verificarAdmin, obtenerDashboardProductos);
router.post('/productos', verificarAdmin, agregarProducto); 
router.put('/productos/:id', verificarAdmin, actualizarProducto); 
router.patch('/productos/estado/:id', verificarAdmin, cambiarEstadoProducto); 
router.delete('/productos/:id', verificarAdmin, eliminarProducto); 

export default router;