import express from 'express';

import {
    getObat,
    getObatById,
    createObat,
    updateObat,
    deleteObat
} from '../controllers/Obat.js';

const router = express.Router();

router.get('/obat', getObat);
router.get('/obat/:id', getObatById);
router.post('/obat', createObat);
router.patch('/obat/:id', updateObat);
router.delete('/obat/:id', deleteObat);

export default router;