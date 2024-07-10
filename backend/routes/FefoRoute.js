import express from 'express';

import {
    getObatByKategori
} from '../controllers/Fefo.js'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.js";


router.get('/api/fefo/:id', verifyUser, getObatByKategori);




export default router;