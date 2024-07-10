import express from 'express';

import {
    getPenjualan,
    createPenjualan,
    deletePenjualan,
    getPenjualanById, 
    updatePenjualan
} from '../controllers/Penjualan.js'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.js";

router.get('/api/penjualan', verifyUser, getPenjualan);
router.get('/api/penjualan/:id', verifyUser, getPenjualanById);
router.post('/api/penjualan', verifyUser, createPenjualan);
router.delete('/api/penjualan/:id', verifyUser, deletePenjualan);
router.put('/api/penjualan/:id', verifyUser, updatePenjualan);



export default router;