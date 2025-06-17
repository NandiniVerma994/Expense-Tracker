import Income from '../models/income.model.js';
import User from '../models/user.model.js';

// Create new income
export const createIncome = async (req, res) => {
    try {
        const { icon, amount, source, date } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!amount || !source) {
            return res.status(400).json({
                success: false,
                message: 'Amount and source are required'
            });
        }

        // Validate amount is positive
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        // Create income
        const income = await Income.create({
            userId,
            icon: icon || '',
            amount,
            source,
            date: date ? new Date(date) : new Date()
        });

        // Populate user info
        // replaces the userId field in your income document with the actual User document 
        await income.populate('userId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Income created successfully',
            data: {
                income
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

// Get all incomes for logged-in user
// Simple Get All Income
export const getAllIncome = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get all incomes for the user
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: 'All incomes retrieved successfully',
            data: incomes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// Delete income
export const deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const income = await Income.findOneAndDelete({ _id: id, userId });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: 'Income not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Income deleted successfully',
            data: {
                income
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

// Get income statistics
export const getIncomeStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { period = 'month' } = req.query; // month, year, week

        let dateFilter = {};
        const now = new Date();

        switch (period) {
            case 'week':
                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                dateFilter = { date: { $gte: weekStart } };
                break;
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = { date: { $gte: monthStart } };
                break;
            case 'year':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                dateFilter = { date: { $gte: yearStart } };
                break;
        }

        // Total income for period
        const totalIncome = await Income.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), ...dateFilter } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        // Income by source
        const incomeBySource = await Income.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), ...dateFilter } },
            { $group: { _id: '$source', total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        // Recent incomes (last 5)
        const recentIncomes = await Income.find({ userId, ...dateFilter })
            .sort({ date: -1 })
            .limit(5)
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Income statistics retrieved successfully',
            data: {
                period,
                totalIncome: totalIncome[0]?.total || 0,
                totalCount: totalIncome[0]?.count || 0,
                incomeBySource,
                recentIncomes
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