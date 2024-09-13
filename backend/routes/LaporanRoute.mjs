import express from 'express';

import {
   getData,
   getFilteredObatKadaluarsa,
   getFilteredObatMendekatiKadaluarsa,
   getLaporanKadaluarsa,
   getLaporanMendekatiKadaluarsa,
   getLaporanObat,
   getLaporanPenjualan,
   getObatKadaluarsaByStok,
   getObatMendekatiKadaluarsaByStok
} from '../controllers/Laporan.mjs';
import { verifyUser } from "../middleware/AuthUser.mjs";

const router = express.Router();

router.get('/api/laporan/data', verifyUser, getData);
router.get('/api/laporan-obat', verifyUser, getLaporanObat);

router.get('/api/laporan-kadaluarsa', getLaporanKadaluarsa);
router.get('/api/laporan-kadaluarsa/filter', getFilteredObatKadaluarsa);
router.get('/api/laporan-kadaluarsa/filter-stok', getObatKadaluarsaByStok);

router.get('/api/laporan-penjualan', getLaporanPenjualan);

router.get('/api/laporan-mendekati-kadaluarsa', getLaporanMendekatiKadaluarsa);
router.get('/api/laporan-mendekati-kadaluarsa/filter', getFilteredObatMendekatiKadaluarsa);
router.get('/api/laporan-mendekati-kadaluarsa/filter-stok', getObatMendekatiKadaluarsaByStok);

export default router;