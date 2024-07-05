import express from 'express';

import {
    getPenjualan,
    createPenjualan,
    deletePenjualan
} from '../controllers/Penjualan.js'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.js";

router.get('/api/penjualan', verifyUser, getPenjualan);
router.post('/api/penjualan', verifyUser, createPenjualan);
router.delete('/api/penjualan/:id', verifyUser, deletePenjualan);



export default router;