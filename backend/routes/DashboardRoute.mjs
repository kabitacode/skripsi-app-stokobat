import express from 'express';

import {
    getData,
    getPenjualanByBulan
} from '../controllers/Dashboard.mjs'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.mjs";

router.get('/api/dashboard', verifyUser, getData);
router.get('/api/dashboard/penjualan', verifyUser, getPenjualanByBulan);




export default router;