import express from 'express';

import {
    logIn,
    logOut,
    Me
} from '../controllers/Auth.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/api/login', logIn);
router.delete('/api/logout', verifyUser, logOut);
router.get('/api/me', verifyUser, Me);

export default router;