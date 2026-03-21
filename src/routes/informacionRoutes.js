import express from 'express';
const router = express.Router();
import { 
    getInformaciones, 
    getInformacionById, 
    upsertInformacion, 
    patchEstado 
} from '../controllers/informacionController.js';

router.get('/', getInformaciones);
router.get('/:id', getInformacionById);
router.post('/', upsertInformacion);
router.patch('/:id/estado', patchEstado); 

export default router;