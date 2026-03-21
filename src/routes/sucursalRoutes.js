import express from 'express';
const router = express.Router();

import { 
    getSucursales, 
    getSucursalById, 
    guardarSucursal, 
    eliminarSucursal 
} from '../controllers/sucursalController.js';

router.get('/', getSucursales);
router.get('/:id', getSucursalById);
router.post('/', guardarSucursal);
router.delete('/:id', eliminarSucursal);

export default router;