import express from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/usuarioController.js';
import { verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/perfil', verificarAdmin, obtenerPerfil);
router.put('/perfil', verificarAdmin, actualizarPerfil);

export default router;