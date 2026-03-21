import express from 'express';
const router = express.Router();
import { getClientes, getClienteById, actualizarCliente, patchEstadoCliente } from '../controllers/clienteController.js';

router.get('/', getClientes);
router.get('/:id', getClienteById);
router.put('/:id', actualizarCliente);
router.patch('/:id/estado', patchEstadoCliente);

export default router;