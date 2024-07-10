import express from 'express';

import {
   getData,
   getLaporanKadaluarsa,
   getLaporanMendekatiKadaluarsa,
   getLaporanObat,
   getLaporanPenjualan
} from '../controllers/Laporan.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/laporan/data', verifyUser, getData);
router.get('/api/laporan-obat', verifyUser, getLaporanObat);
router.get('/api/laporan-kadaluarsa', getLaporanKadaluarsa);
router.get('/api/laporan-penjualan', getLaporanPenjualan);
router.get('/api/laporan-mendekati-kadaluarsa', getLaporanMendekatiKadaluarsa);

export default router;