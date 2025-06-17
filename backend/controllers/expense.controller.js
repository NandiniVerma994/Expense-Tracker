import Expense from '../models/expense.model.js';
import mongoose from 'mongoose';

// Add Expense
export const addExpense = async (req, res) => {
    try {
        const { icon, category, amount, date } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!amount || !category) {
            return res.status(400).json({
                success: false,
                message: 'Amount and category are required'
            });
        }

        // Validate amount is positive
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        // Create expense
        const expense = await Expense.create({
            userId,
            icon: icon || '',
            category,
            amount,
            date: date ? new Date(date) : new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            data: {
                expense
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get All Expenses
export const getAllExpense = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get all expenses for the user
        // Can populate user information when needed
        const expenses = await Expense.find({ userId }).populate('userId', 'name email').sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            message: 'All expenses retrieved successfully',
            data: expenses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid expense ID'
            });
        }

        const expense = await Expense.findOneAndDelete({ _id: id, userId });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: {
                deletedExpense: expense
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

