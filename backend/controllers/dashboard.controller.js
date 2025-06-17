// controllers/DashboardController.js

import mongoose from "mongoose";
import Income from "../models/income.model.js";
import Expense from "../models/expense.model.js";

const isValidObjectId = mongoose.Types.ObjectId.isValid;

export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const [totalIncomeAgg, totalExpenseAgg] = await Promise.all([
            Income.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: { userId: userObjectId } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        const totalIncome = totalIncomeAgg[0]?.total || 0;
        const totalExpense = totalExpenseAgg[0]?.total || 0;

        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [last60DaysIncomeTransactions, last30DaysExpenseTransactions] = await Promise.all([
            Income.find({ userId: userObjectId, date: { $gte: sixtyDaysAgo } }).sort({ date: -1 }),
            Expense.find({ userId: userObjectId, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 })
        ]);

        const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, txn) => sum + txn.amount, 0
        );
        const totalExpensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, txn) => sum + txn.amount, 0
        );

        const [latestIncomes, latestExpenses] = await Promise.all([
            Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5),
            Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
        ]);

        const formattedIncomes = latestIncomes.map(txn => ({
            ...txn.toObject(),
            type: "income"
        }));

        const formattedExpenses = latestExpenses.map(txn => ({
            ...txn.toObject(),
            type: "expense"
        }));

        const lastTransactions = [...formattedIncomes, ...formattedExpenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: {
                totalBalance: totalIncome - totalExpense,
                totalIncome,
                totalExpense,
                totalIncomeLast60Days,
                totalExpensesLast30Days,
                last60DaysIncomeTransactions,
                last30DaysExpenseTransactions,
                lastTransactions
            }
        });

    } catch (error) {
        console.error("Error in getDashboardData:", error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving dashboard data',
            error: error.message
        });
    }
};
