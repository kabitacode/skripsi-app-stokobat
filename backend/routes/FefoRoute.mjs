import express from 'express';

import {
    getObatByKategori
} from '../controllers/Fefo.mjs'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.mjs";


router.get('/api/fefo/:id', verifyUser, getObatByKategori);




export default router;