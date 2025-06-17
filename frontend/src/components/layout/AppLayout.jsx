import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "User", profileUrl: "" });
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        const response = await axios.get(
          "http://localhost:4000/api/users/profile",
          { withCredentials: true }
        );
        setUserData(response.data.data.user);
      } catch (err) {
        console.error("Failed to fetch user data for layout:", err);
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/users/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarWidthClass = "w-3/4 sm:w-1/2 md:w-1/4 lg:w-1/5 xl:w-1/6";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-20 p-4 bg-white dark:bg-gray-800 shadow-md flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Expense Tracker
        </h1>
      </header>
      <div className="flex flex-1 pt-16">
        <aside
          className={`
            fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-10
            ${sidebarWidthClass}
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            overflow-y-auto pt-20
          `}
        >
          <div className="p-4 flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-3 border-2 border-primary">
              <AvatarImage
                src={userData.profileUrl}
                alt={`${userData.name}'s profile`}
              />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {loadingUser
                  ? "..."
                  : userData.name
                  ? userData.name.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {loadingUser ? "Loading..." : `Hi, ${userData.name}!`}
            </p>
          </div>
          <nav className="p-4 pt-0">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/income"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Income
                </Link>
              </li>
              <li>
                <Link
                  to="/expenses"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Expenses
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-800 transition-colors w-full justify-start"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <main
          className={`
            flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "ml-[75vw] sm:ml-[50vw] md:ml-[25vw] lg:ml-[20vw] xl:ml-[16.666vw]"
                : "ml-0"
            }
            ${isSidebarOpen ? "blur-sm pointer-events-none" : ""}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
