import express from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/usuarioController.js';
import { verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/perfil-admin', verificarAdmin, obtenerPerfil);
router.put('/actualizar-admin', verificarAdmin, actualizarPerfil);

export default router;