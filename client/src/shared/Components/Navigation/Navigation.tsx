import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { useAuth } from "../../Hooks/useAuth";

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notifications.show({
      title: "Logged out",
      message: "You have been successfully logged out",
      color: "green",
    });
    navigate("/login");
  };

  if (!user) {
    return null; // Don't show navigation if user is not logged in
  }

  const navItems = [
    { path: "/all-products", label: "All Products" },
    { path: "/my-products", label: "My Products" },
    { path: "/product/new", label: "Create Product" },
    { path: "/transaction-history", label: "Transaction History" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              to="/all-products"
              className="text-xl font-bold text-gray-800 hover:text-gray-600"
            >
              Teebay
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <Text size="sm" className="text-gray-600">
              Welcome, {user.firstName}
            </Text>
            <Button variant="outline" color="red" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
