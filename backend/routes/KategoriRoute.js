import express from 'express';

import {
    getKategori,
    getKategoriById,
    createKategori,
    updateKategori,
    deleteKategori
} from '../controllers/Kategori.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/kategori', verifyUser, getKategori);
router.get('/kategori/:id', verifyUser, getKategoriById);
router.post('/kategori', verifyUser, createKategori);
router.patch('/kategori/:id', verifyUser, updateKategori);
router.delete('/kategori/:id', verifyUser, deleteKategori);

export default router;