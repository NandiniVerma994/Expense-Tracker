import express from 'express';
import {
    createIncome,
    getAllIncome,
    
    deleteIncome,
    
} from '../controllers/income.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/addIncome', createIncome);
router.get('/getIncome', getAllIncome);
router.delete('/deleteIncome/:id', deleteIncome);

router.delete('/:id', deleteIncome);

export default router;