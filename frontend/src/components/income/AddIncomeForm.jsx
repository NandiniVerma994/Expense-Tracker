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
} from "@/components/ui/select"; // Import Select components
import { toast } from "sonner";

// --- NEW: Define your predefined income sources ---
const incomeSources = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
  { value: "rental", label: "Rental Income" },
  { value: "other", label: "Other" },
];

const AddIncomeForm = ({ onIncomeAdded }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !amount) {
      toast.error("Validation Error", {
        description: "Source and Amount are required.",
      });
      return;
    }

    setLoading(true);
    try {
      // Find the selected source object to get its 'value' as the icon name
      const selectedSource = incomeSources.find((src) => src.value === source);

      const incomeData = {
        source: selectedSource.label, // Send the full label (e.g., "Salary")
        amount: parseFloat(amount),
        date,
        icon: selectedSource.value, // Send the value as the icon name (e.g., "salary")
      };

      await axios.post(
        "http://localhost:4000/api/incomes/addIncome",
        incomeData,
        { withCredentials: true }
      );
      toast.success("Success!", {
        description: "New income has been added.",
      });
      onIncomeAdded();
    } catch (error) {
      console.error("Failed to add income:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to add income.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {/* --- UPDATED: Source Dropdown --- */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="source" className="text-right">
          Source
        </Label>
        <Select onValueChange={setSource} value={source}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent>
            {incomeSources.map((src) => (
              <SelectItem key={src.value} value={src.value}>
                {src.label}
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
          placeholder="e.g., 50000"
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

      {/* The icon field is now handled automatically by the source selection */}

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Income"}
      </Button>
    </form>
  );
};

export default AddIncomeForm;
