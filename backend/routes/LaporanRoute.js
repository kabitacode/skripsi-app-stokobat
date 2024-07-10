import express from 'express';

import {
   getData,
   getLaporan
} from '../controllers/Laporan.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/laporan', verifyUser, getLaporan);
router.get('/api/laporan/data', verifyUser, getData);

export default router;