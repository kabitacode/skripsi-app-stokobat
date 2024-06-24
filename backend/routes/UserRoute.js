import express from 'express';

import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/Users';

const router = express.Router();

router.get('/users', getUser);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;