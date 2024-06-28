import express from 'express';

import {
    logIn,
    logOut,
    Me
} from '../controllers/Auth.js';

const router = express.Router();

router.post('/api/login', logIn);
router.delete('/api/logout', logOut);
router.get('/api/me', Me);

export default router;