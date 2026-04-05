import express from 'express';
const router = express.Router();
import { 
    getUsuarios, 
    getUsuarioById, 
    upsertUsuario, 
    patchEstadoUsuario
} from '../controllers/adminusuarioController.js';

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', upsertUsuario);
router.patch('/:id/estado', patchEstadoUsuario);

export default router;