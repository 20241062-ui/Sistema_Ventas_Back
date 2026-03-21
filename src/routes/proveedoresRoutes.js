import express from 'express';
const router = express.Router();
import { 
    getProveedores, 
    getProveedorByRFC, 
    guardarProveedor, 
    eliminarProveedor 
} from '../controllers/proveedoresController.js';

router.get('/', getProveedores);             
router.get('/:rfc', getProveedorByRFC);      
router.post('/', guardarProveedor);          
router.delete('/:rfc', eliminarProveedor);  

export default router;