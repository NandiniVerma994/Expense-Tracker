// src/pages/SignupPage.jsx
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
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Eye, EyeOff } from "lucide-react";

// Chart data (same as Login page for consistency)
const chartData = [
  { month: "Jan", transactions: 1200 },
  { month: "Feb", transactions: 1900 },
  { month: "Mar", transactions: 1500 },
  { month: "Apr", transactions: 2200 },
  { month: "May", transactions: 1800 },
  { month: "Jun", transactions: 2500 },
];

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for profile image
  const [profileImage, setProfileImage] = useState(null); // Stores URL for preview
  const [profileImageFile, setProfileImageFile] = useState(null); // Stores the actual File object
  const [profileImageError, setProfileImageError] = useState("");

  // Error states for form fields
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState(""); // New state for general API errors

  // New state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Handler for image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImageError(""); // Clear previous errors

    if (file) {
      if (!file.type.startsWith("image/")) {
        setProfileImageError("Please upload an image file (e.g., JPG, PNG).");
        setProfileImage(null);
        setProfileImageFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setProfileImageError("Image size must be less than 5MB.");
        setProfileImage(null);
        setProfileImageFile(null);
        return;
      }

      setProfileImage(URL.createObjectURL(file)); // Create a URL for preview
      setProfileImageFile(file); // Store the file object itself
    } else {
      setProfileImage(null);
      setProfileImageFile(null);
    }
  };

  const handleSignup = async (e) => {
    // Make handleSignup async
    e.preventDefault();

    // Reset errors
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setProfileImageError("");
    setGeneralError(""); // Clear previous general errors

    let isValid = true;

    // Username Validation
    if (!username.trim()) {
      setUsernameError("Username is required.");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      isValid = false;
    }

    // Email Validation
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password Validation
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    // You might also add an isValid check for profileImageError if the image is required
    // if (profileImageError) isValid = false;

    if (isValid) {
      console.log(
        "Client-side validation passed. Initiating API call for signup..."
      );

      // Create FormData object to send text fields and the file
      const formData = new FormData();
      formData.append("name", username); // Backend expects 'name' for username
      formData.append("email", email);
      formData.append("password", password);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile); // 'profileImage' is the field name your backend expects (req.file.fieldname)
      }

      try {
        const response = await axios.post(
          "http://localhost:4000/api/users/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Crucial for file uploads
            },
            withCredentials: true, // Important for sending/receiving cookies
          }
        );

        console.log("Signup successful!", response.data);
        alert(response.data.message); // Show success message from backend
        navigate("/login"); // Redirect to login page after successful signup
      } catch (error) {
        if (error.response) {
          console.error("Signup failed:", error.response.data.message);
          setGeneralError(
            error.response.data.message || "Signup failed. Please try again."
          );
        } else if (error.request) {
          console.error("Network error during signup:", error.request);
          setGeneralError(
            "No response from server. Please check your connection."
          );
        } else {
          console.error("Error setting up request:", error.message);
          setGeneralError(
            "An unexpected error occurred during signup. Please try again."
          );
        }
      }
    } else {
      console.log("Signup failed: Client-side validation errors.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Half: Signup Form and Branding */}
      <div className="w-1/2 relative flex flex-col justify-center items-center px-12 py-8 bg-white dark:bg-gray-800">
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-6">
          <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-200">
            Create Your Account
          </h2>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Join us to start tracking your expenses and take control of your
            finances.
          </p>

          {/* --- PROFILE PHOTO UPLOAD OPTION --- */}
          <div className="relative w-24 h-24 mb-4 group">
            <label
              htmlFor="profile-upload"
              className="cursor-pointer block w-full h-full"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-10 h-10 text-gray-400 dark:text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">
                  Upload Photo
                </span>
              </div>
            </label>
            {profileImageError && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {profileImageError}
              </p>
            )}
          </div>
          {/* --- END PROFILE PHOTO UPLOAD OPTION --- */}

          <form className="w-full" onSubmit={handleSignup}>
            <div className="grid gap-3">
              {/* Username Field */}
              <div className="grid gap-1">
                <label
                  htmlFor="username"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={usernameError ? "border-red-500" : ""}
                />
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                )}
              </div>

              {/* Email Field */}
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
                  placeholder="m@example.com"
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
                  {" "}
                  {/* Wrapper for Input and Icon */}
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Dynamic type
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={passwordError ? "border-red-500 pr-10" : "pr-10"} // Add padding-right
                  />
                  <button
                    type="button" // Important: type="button" to prevent form submission
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}{" "}
                    {/* Toggle icon */}
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
                Sign Up
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Log in
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

export default Signup;
