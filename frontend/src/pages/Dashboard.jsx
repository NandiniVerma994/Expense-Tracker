import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppLayout from "../components/layout/AppLayout.jsx";

// --- Charting Imports ---
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

// --- UI & Icon Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  ArrowUp,
  ArrowDown,
  Landmark,
  Utensils,
  ShoppingBag,
  Car,
  CircleDollarSign,
  ArrowRight,
  BarChartHorizontal,
  Wallet,
} from "lucide-react";

// --- Helper Functions ---
const iconMap = {
  salary: <Landmark className="h-6 w-6" />,
  freelance: <CircleDollarSign className="h-6 w-6" />,
  food: <Utensils className="h-6 w-6" />,
  shopping: <ShoppingBag className="h-6 w-6" />,
  transport: <Car className="h-6 w-6" />,
  default: <CircleDollarSign className="h-6 w-6" />,
};

const getTransactionIcon = (iconName) => {
  const key = (iconName || "default").toLowerCase();
  return iconMap[key] || iconMap.default;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setErrorDashboard(null);
      const response = await axios.get(
        "http://localhost:4000/api/dashboard/getData",
        { withCredentials: true }
      );
      setDashboardData(response.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setErrorDashboard("Failed to load dashboard data. Please try again.");
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    window.addEventListener("focus", fetchDashboardData);
    return () => {
      window.removeEventListener("focus", fetchDashboardData);
    };
  }, [fetchDashboardData]);

  const incomeAllocationData = useMemo(() => {
    if (!dashboardData) return [];
    return [
      {
        name: "Expenses",
        value: dashboardData.totalExpense || 0,
        fill: "#ef4444",
      },
      {
        name: "Balance",
        value: dashboardData.totalBalance > 0 ? dashboardData.totalBalance : 0,
        fill: "#22c55e",
      },
    ];
  }, [dashboardData]);

  const monthlyExpensesData = useMemo(() => {
    if (!dashboardData?.last30DaysExpenseTransactions) return [];
    const expensesByCategory =
      dashboardData.last30DaysExpenseTransactions.reduce((acc, txn) => {
        const category = txn.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += txn.amount;
        return acc;
      }, {});

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  }, [dashboardData]);

  const last60DaysIncomeData = useMemo(() => {
    if (!dashboardData?.last60DaysIncomeTransactions) return [];
    const incomeBySource = dashboardData.last60DaysIncomeTransactions.reduce(
      (acc, txn) => {
        const source = txn.source || "Uncategorized";
        if (!acc[source]) {
          acc[source] = 0;
        }
        acc[source] += txn.amount;
        return acc;
      },
      {}
    );

    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981"];
    return Object.entries(incomeBySource).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }));
  }, [dashboardData]);

  return (
    <AppLayout>
      {loadingDashboard ? (
        <div className="flex justify-center items-center h-full">
          Loading...
        </div>
      ) : errorDashboard ? (
        <div className="flex justify-center items-center h-full text-red-500">
          {errorDashboard}
        </div>
      ) : dashboardData ? (
        <div className="space-y-6">
          {/* Top row: Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.totalBalance)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(dashboardData.totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(dashboardData.totalExpense)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second row with Transactions and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  {/* <Link to="/transactions">
                    See All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link> */}
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {dashboardData.lastTransactions &&
                  dashboardData.lastTransactions.length > 0 ? (
                    dashboardData.lastTransactions.slice(0, 5).map((txn) => (
                      <li key={txn._id} className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {getTransactionIcon(
                            txn.icon || txn.category || txn.source
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">
                            {txn.source || txn.category}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 font-bold ${
                            txn.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {txn.type === "income" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )}
                          {formatCurrency(txn.amount)}
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No recent transactions to display.
                    </p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Income Allocation</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Tooltip
                      formatter={(value, name) => [formatCurrency(value), name]}
                    />
                    <Pie
                      data={incomeAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomeAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  {incomeAllocationData.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      ></span>
                      <span className="text-muted-foreground">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third row with 30-day Expense analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Details (Last 30 Days)</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/expenses">
                    See All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {dashboardData.last30DaysExpenseTransactions &&
                  dashboardData.last30DaysExpenseTransactions.length > 0 ? (
                    dashboardData.last30DaysExpenseTransactions
                      .slice(0, 5)
                      .map((txn) => (
                        <li key={txn._id} className="flex items-center gap-4">
                          <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {getTransactionIcon(txn.icon || txn.category)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{txn.category}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(txn.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="font-bold text-red-500">
                            {formatCurrency(txn.amount)}
                          </div>
                        </li>
                      ))
                  ) : (
                    <p className="text-muted-foreground">
                      No expenses to display for the last 30 days.
                    </p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Last 30 Days Expenses</CardTitle>
                <CardDescription>By Category</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                {monthlyExpensesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={monthlyExpensesData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        width={80}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value), "Total"]}
                      />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BarChartHorizontal className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No expenses recorded in the last 30 days.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fourth row with 60-day Income analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Last 60 Days Income</CardTitle>
                <CardDescription>By Source</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                {last60DaysIncomeData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Tooltip
                          formatter={(value, name) => [
                            formatCurrency(value),
                            name,
                          ]}
                        />
                        <Pie
                          data={last60DaysIncomeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {last60DaysIncomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex-col justify-center gap-6 text-sm">
                      {last60DaysIncomeData.map((entry, index) => (
                        <div
                          key={`legend-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.fill }}
                          ></span>
                          <span className="text-muted-foreground">
                            {entry.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Wallet className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No income recorded in the last 60 days.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              {/* --- THIS IS THE FIX --- */}
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Income Details (Last 60 Days)</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/income">
                    See All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              {/* --- THE PREVIOUS TAG WAS </Header> --- */}
              <CardContent>
                <ul className="space-y-4">
                  {dashboardData.last60DaysIncomeTransactions &&
                  dashboardData.last60DaysIncomeTransactions.length > 0 ? (
                    dashboardData.last60DaysIncomeTransactions.map((txn) => (
                      <li key={txn._id} className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {getTransactionIcon(txn.icon || txn.source)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{txn.source}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="font-bold text-green-500">
                          {formatCurrency(txn.amount)}
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No income to display.
                    </p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
};

export default Dashboard;
