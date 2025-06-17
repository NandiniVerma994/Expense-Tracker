import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // <-- Import Select components
import { toast } from "sonner";

// --- NEW: Define your predefined categories ---
const expenseCategories = [
  { value: "food", label: "Food" },
  { value: "shopping", label: "Shopping" },
  { value: "transport", label: "Transport" },
  { value: "bills", label: "Bills" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const AddExpenseForm = ({ onExpenseAdded }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount) {
      toast.error("Validation Error", {
        description: "Category and Amount are required.",
      });
      return;
    }

    setLoading(true);
    try {
      // Find the selected category object to get its 'value' as the icon name
      const selectedCategory = expenseCategories.find(
        (cat) => cat.value === category
      );

      const expenseData = {
        category: selectedCategory.label, // Send the full label (e.g., "Shopping")
        amount: parseFloat(amount),
        date,
        icon: selectedCategory.value, // Send the value as the icon name (e.g., "shopping")
      };

      await axios.post(
        "http://localhost:4000/api/expenses/addExpense",
        expenseData,
        { withCredentials: true }
      );
      toast.success("Success!", {
        description: "New expense has been added.",
      });
      onExpenseAdded();
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to add expense.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {/* --- UPDATED: Category Dropdown --- */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {expenseCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="col-span-3"
          placeholder="e.g., 1500"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="col-span-3"
        />
      </div>

      {/* The icon field is now handled automatically by the category selection, so we can remove it */}

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </Button>
    </form>
  );
};

export default AddExpenseForm;
