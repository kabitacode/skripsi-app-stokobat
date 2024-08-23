import express from 'express';

import {
    getData
} from '../controllers/Dashboard.mjs'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.mjs";

router.get('/api/dashboard', verifyUser, getData);




export default router;