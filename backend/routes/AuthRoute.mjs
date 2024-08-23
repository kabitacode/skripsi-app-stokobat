import express from 'express';

import {
    logIn,
    logOut,
    Me,
    register
} from '../controllers/Auth.mjs';
import { verifyUser } from "../middleware/AuthUser.mjs";

const router = express.Router();

router.post('/api/login', logIn);
router.delete('/api/logout', verifyUser, logOut);
router.get('/api/me', verifyUser, Me);
router.post('/api/register', register);

export default router;