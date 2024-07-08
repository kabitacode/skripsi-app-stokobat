import express from 'express';

import {
   getLaporan
} from '../controllers/Laporan.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/laporan', verifyUser, getLaporan);

export default router;