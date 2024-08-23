import express from 'express';

import {
    getKategori,
    getKategoriById,
    createKategori,
    updateKategori,
    deleteKategori
} from '../controllers/Kategori.mjs';
import { verifyUser } from "../middleware/AuthUser.mjs";

const router = express.Router();

router.get('/api/kategori', verifyUser, getKategori);
router.get('/api/kategori/:id', verifyUser, getKategoriById);
router.post('/api/kategori', verifyUser, createKategori);
router.patch('/api/kategori/:id', verifyUser, updateKategori);
router.delete('/api/kategori/:id', verifyUser, deleteKategori);

export default router;