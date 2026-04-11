import express from 'express';
import { 
    obtenerPoliticas, 
    obtenerFAQ, 
    obtenerContactoInfo, 
    enviarMensajeContacto,
    obtenerMarcas,
    obtenerCategorias
} from '../controllers/publicController.js';

import { obtenerDashboardProductos } from '../controllers/productoController.js';

const router = express.Router();

router.get('/politicas', obtenerPoliticas);
router.get('/faq', obtenerFAQ);
router.get('/contacto-info', obtenerContactoInfo);
router.post('/enviar-mensaje', enviarMensajeContacto);

router.get('/marcas', obtenerMarcas);
router.get('/categorias', obtenerCategorias);

router.get('/home', obtenerDashboardProductos);

export default router;