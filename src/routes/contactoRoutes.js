import express from 'express';
const router = express.Router();
import { 
    getContactos, 
    getContactoById, 
    upsertContacto, 
    deleteContacto 
} from '../controllers/contactoController.js';

router.get('/', getContactos);
router.get('/:id', getContactoById);
router.post('/', upsertContacto);
router.delete('/:id', deleteContacto);

export default router;