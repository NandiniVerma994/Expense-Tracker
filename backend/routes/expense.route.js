import express from 'express';
import {
    addExpense,
    getAllExpense,
    deleteExpense,
    
} from '../controllers/expense.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Expense routes
router.post('/addExpense', addExpense);
router.get('/all', getAllExpense);
router.delete('/:id', deleteExpense);


export default router;