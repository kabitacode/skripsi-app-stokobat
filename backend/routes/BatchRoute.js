import express from 'express';

import {
    getBatch,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
} from '../controllers/Batch.js'

const router = express.Router();

router.get('/api/batch', getBatch);
router.get('/api/batch/:id', getBatchById);
router.post('/api/batch', createBatch);
router.put('/api/batch', updateBatch);
router.delete('/api/batch/:id', deleteBatch);


export default router;