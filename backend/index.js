import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './database/db.js'
import userRoutes from './routes/user.route.js'
import incomeRoutes from './routes/income.route.js' // Assuming incomeRoutes is imported
import expenseRoutes from './routes/expense.route.js'
import dashboardRoutes from './routes/dashboard.route.js'


dotenv.config()
connectDB()
const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173', // <--- Change '*' to your frontend's exact origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // <--- Crucial for sending/receiving httpOnly cookies
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Important for form-data
app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/incomes', incomeRoutes) // Assuming incomeRoutes is imported
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes); // Assuming getDashboardData is a middleware


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
