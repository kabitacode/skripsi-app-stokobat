import express from 'express';

import {
    getObat,
    getObatById,
    createObat,
    updateObat,
    deleteObat,
    searchObat
} from '../controllers/Obat.js';
import {verifyUser} from '../middleware/AuthUser.js'

const router = express.Router();

router.get('/obat', verifyUser, getObat);
router.get('/obat/:id', verifyUser, getObatById);
router.post('/obat', verifyUser, createObat);
router.patch('/obat/:id', verifyUser, updateObat);
router.delete('/obat/:id', verifyUser, deleteObat);


export default router;