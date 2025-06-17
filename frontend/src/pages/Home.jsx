import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react"; // A fitting icon for a finance app

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-8">
        <div className="flex items-center gap-2">
          <Wallet className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h1>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Aesthetic Headline */}
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Unlock Financial Clarity.
          </h2>

          {/* Supporting Text */}
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Effortlessly track your spending, understand your habits, and build
            a brighter financial future. One entry at a time.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="font-semibold">
                Get Started for Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-semibold">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Section (Optional but good for completeness) */}
      <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Expense Tracker. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
