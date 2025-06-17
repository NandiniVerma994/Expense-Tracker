// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios"; // Import axios
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const chartData = [
  { month: "Jan", transactions: 1200 },
  { month: "Feb", transactions: 1900 },
  { month: "Mar", transactions: 1500 },
  { month: "Apr", transactions: 2200 },
  { month: "May", transactions: 1800 },
  { month: "Jun", transactions: 2500 },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!email.includes("@gmail.com")) {
      setEmailError("Email must be a @gmail.com address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    if (isValid) {
      console.log("Attempting login...", { email, password });
      try {
        // Using axios.post for POST requests
        const response = await axios.post(
          "http://localhost:4000/api/users/login",
          {
            email, // axios automatically JSON.stringify-s the data object
            password,
          },
          {
            withCredentials: true, // Important for sending/receiving cookies (like your auth token)
          }
        );

        // Axios automatically parses JSON responses into response.data
        console.log("Login successful!", response.data);
        toast.success(response.data.message); // Show success message from backend
        navigate("/dashboard"); // Redirect upon successful login
      } catch (error) {
        // Axios wraps errors in an 'error' object.
        // Check for error.response for server errors (e.g., 400, 500)
        if (error.response) {
          console.error("Login failed:", error.response.data.message);
          setGeneralError(
            error.response.data.message || "Login failed. Please try again."
          );
        } else if (error.request) {
          // The request was made but no response was received (e.g., network error)
          console.error("Network error during login:", error.request);
          setGeneralError(
            "No response from server. Please check your connection."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      }
    } else {
      console.log("Client-side validation failed.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Half: Login Form and Branding */}
      <div className="w-1/2 relative flex flex-col justify-center items-center px-12 py-8 bg-white dark:bg-gray-800">
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-6">
          <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-200">
            Welcome Back!
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Log in to continue managing your finances and tracking your spending
            habits.
          </p>

          <form className="w-full" onSubmit={handleLogin}>
            <div className="grid gap-3">
              <div className="grid gap-1">
                <label
                  htmlFor="email"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="grid gap-1">
                <label
                  htmlFor="password"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={passwordError ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              {generalError && (
                <p className="text-red-500 text-sm text-center">
                  {generalError}
                </p>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Half: Demo Bar Chart */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Monthly Transactions Overview
        </h3>
        <div className="w-full max-w-md h-[300px] flex items-center justify-center">
          <ChartContainer
            config={{
              transactions: {
                label: "Transactions",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="min-h-[200px] w-full"
          >
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                className="text-sm text-gray-600 dark:text-gray-400"
              />
              <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="transactions"
                fill="hsl(var(--chart-1))"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Login;
