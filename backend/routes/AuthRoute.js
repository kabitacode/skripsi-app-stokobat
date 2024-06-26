import express from 'express';

import {
    logIn,
    logOut,
    Me
} from '../controllers/Auth.js';

const router = express.Router();

router.post('/login', logIn);
router.delete('/logout', logOut);
router.get('/me', Me);

export default router;