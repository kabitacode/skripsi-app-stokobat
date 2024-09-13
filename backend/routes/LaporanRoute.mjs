import express from 'express';

import {
   getData,
   getFilteredObatKadaluarsa,
   getLaporanKadaluarsa,
   getLaporanMendekatiKadaluarsa,
   getLaporanObat,
   getLaporanPenjualan
} from '../controllers/Laporan.mjs';
import { verifyUser } from "../middleware/AuthUser.mjs";

const router = express.Router();

router.get('/api/laporan/data', verifyUser, getData);
router.get('/api/laporan-obat', verifyUser, getLaporanObat);

router.get('/api/laporan-kadaluarsa', getLaporanKadaluarsa);
router.get('/api/laporan-kadaluarsa/filter', getFilteredObatKadaluarsa);

router.get('/api/laporan-penjualan', getLaporanPenjualan);
router.get('/api/laporan-mendekati-kadaluarsa', getLaporanMendekatiKadaluarsa);

export default router;