import express from 'express';

import {
    getBatch,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
} from '../controllers/Batch.js'

const router = express.Router();

router.get('/batch', getBatch);
router.get('/batch/:id', getBatchById);
router.post('/batch', createBatch);
router.put('/batch', updateBatch);
router.delete('/batch/:id', deleteBatch);


export default router;