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
import * as categoriaCtrl from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/productos', verificarAdmin, obtenerDashboardProductos);
router.post('/productos', verificarAdmin, agregarProducto); 
router.put('/productos/:id', verificarAdmin, actualizarProducto); 
router.patch('/productos/estado/:id', verificarAdmin, cambiarEstadoProducto); 
router.delete('/productos/:id', verificarAdmin, eliminarProducto); 
router.get('/marcas', verificarAdmin, marcaCtrl.listarMarcas);
router.get('/marcas/:id', verificarAdmin, marcaCtrl.obtenerMarca);
router.post('/marcas', verificarAdmin, marcaCtrl.guardarMarca);
router.put('/marcas/:id', verificarAdmin, marcaCtrl.actualizarMarca);
router.delete('/marcas/:id', verificarAdmin, marcaCtrl.eliminarMarca);
router.get('/categorias', verificarAdmin, categoriaCtrl.listarCategorias);
router.get('/categorias/:id', verificarAdmin, categoriaCtrl.obtenerCategoria);
router.post('/categorias', verificarAdmin, categoriaCtrl.guardarCategoria);
router.put('/categorias/:id', verificarAdmin, categoriaCtrl.actualizarCategoria);
router.delete('/categorias/:id', verificarAdmin, categoriaCtrl.eliminarCategoria);
router.patch('/categorias/:id/activar', verificarAdmin, categoriaCtrl.reactivarCategoria);

export default router;