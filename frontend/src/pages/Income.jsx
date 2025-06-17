import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AppLayout from "../components/layout/AppLayout";
import AddIncomeForm from "../components/income/AddIncomeForm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, PlusCircle } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/incomes/getIncome",
        { withCredentials: true }
      );
      setIncomes(response.data.data);
    } catch (err) {
      setError("Failed to fetch income data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async () => {
    if (!incomeToDelete) return;
    try {
      // --- THE FIX IS HERE ---
      // Added { withCredentials: true } to the delete request
      await axios.delete(
        `http://localhost:4000/api/incomes/deleteIncome/${incomeToDelete}`,
        { withCredentials: true } // This ensures your auth cookie is sent
      );

      toast.success("Success", {
        description: "Income record deleted.",
      });
      // This line updates the UI by removing the deleted item from the state
      setIncomes(incomes.filter((inc) => inc._id !== incomeToDelete));
      setIncomeToDelete(null); // This closes the confirmation dialog
    } catch (err) {
      toast.error("Error", {
        description: "Failed to delete income record.",
      });
      console.error(err);
      setIncomeToDelete(null); // Also close dialog on error
    }
  };

  const chartData = useMemo(() => {
    return incomes
      .slice(0, 7) // Show last 7 incomes
      .map((inc) => ({
        name: new Date(inc.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: inc.amount,
      }))
      .reverse(); // To show oldest first
  }, [incomes]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Income Overview</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
              </DialogHeader>
              <AddIncomeForm
                onIncomeAdded={() => {
                  setIsAddDialogOpen(false);
                  fetchIncomes(); // Refresh data after adding
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Income</CardTitle>
            <CardDescription>
              A look at your last 7 income entries.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Amount"]}
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>
              A complete list of all your income records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : incomes.length > 0 ? (
                  incomes.map((income) => (
                    <TableRow key={income._id}>
                      <TableCell className="font-medium">
                        {income.source}
                      </TableCell>
                      <TableCell>
                        {new Date(income.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        {formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIncomeToDelete(income._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center">
                      No income records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!incomeToDelete}
        onOpenChange={() => setIncomeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              income record from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Income;
