import express from 'express';
const router = express.Router();
import { 
    getProveedores, 
    getProveedorByRFC, 
    guardarProveedor, 
    eliminarProveedor,
    reactivarProveedor
} from '../controllers/proveedoresController.js';

router.get('/', getProveedores);             
router.get('/:rfc', getProveedorByRFC);      
router.post('/', guardarProveedor);          
router.delete('/:rfc', eliminarProveedor);
router.patch('/:rfc/activar', reactivarProveedor);

export default router;