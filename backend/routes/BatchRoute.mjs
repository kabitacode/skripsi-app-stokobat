import express from 'express';

import {
    getBatch,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
} from '../controllers/Batch.mjs'

const router = express.Router();
import { verifyUser } from "../middleware/AuthUser.mjs";

router.get('/api/batch', verifyUser, getBatch);
router.get('/api/batch/:id', verifyUser, getBatchById);
router.post('/api/batch', verifyUser, createBatch);
router.patch('/api/batch/:id', verifyUser, updateBatch);
router.delete('/api/batch/:id', verifyUser, deleteBatch);


export default router;