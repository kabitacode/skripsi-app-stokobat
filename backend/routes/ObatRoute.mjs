import express from 'express';

import {
    getObat,
    getObatById,
    createObat,
    updateObat,
    deleteObat,
    updateKadaluarsa,
    getFilteredObat
} from '../controllers/Obat.mjs';
import {verifyUser} from '../middleware/AuthUser.mjs'

const router = express.Router();

router.get('/api/obat', verifyUser, getObat);
router.get('/api/obat/filter', verifyUser, getFilteredObat);
router.get('/api/obat/:id', verifyUser, getObatById);
router.post('/api/obat', verifyUser, createObat);
router.patch('/api/obat/:id', verifyUser, updateObat);
router.delete('/api/obat/:id', verifyUser, deleteObat);
router.put('/api/obat/updateKadaluarsa', updateKadaluarsa);


export default router;