import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
import { 
    obtenerDashboardProductos, 
    agregarProducto, 
    actualizarProducto, 
    cambiarEstadoProducto, 
    eliminarProducto 
} from '../controllers/productoController.js';
import * as marcaCtrl from '../controllers/marcaController.js';

const router = express.Router();

router.get('/productos', verificarAdmin, obtenerDashboardProductos);
router.post('/productos', verificarAdmin, agregarProducto); 
router.put('/productos/:id', verificarAdmin, actualizarProducto); 
router.patch('/productos/estado/:id', verificarAdmin, cambiarEstadoProducto); 
router.delete('/productos/:id', verificarAdmin, eliminarProducto); 
router.get('/marcas', marcaCtrl.listarMarcas);
router.get('/marcas/:id', marcaCtrl.obtenerMarca);
router.post('/marcas', marcaCtrl.guardarMarca);
router.put('/marcas/:id', marcaCtrl.actualizarMarca);
router.delete('/marcas/:id', marcaCtrl.eliminarMarca);

export default router;