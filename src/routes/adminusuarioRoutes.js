import express from 'express';
const router = express.Router();
import { 
    getUsuarios, 
    getUsuarioById, 
    upsertUsuario, 
    patchEstadoUsuario, 
    deleteUsuario 
} from '../controllers/adminusuarioController.js';

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', upsertUsuario);
router.patch('/:id/estado', patchEstadoUsuario);
router.delete('/:id', deleteUsuario);

export default router;