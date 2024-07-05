import express from 'express';

import {
    getData
} from '../controllers/Dashboard.js'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.js";

router.get('/api/dashboard', verifyUser, getData);




export default router;