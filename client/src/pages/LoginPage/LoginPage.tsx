import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { Button, PasswordInput, TextInput } from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { LOGIN_USER } from "../../graphql/user/mutations";
import { useAuth } from "../../shared/Hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/my-products";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notifications.show({
        title: "Validation error",
        message: "Email and password are required.",
        color: "yellow",
      });
      return;
    }

    try {
      const response = await loginUser({ variables: { email, password } });
      const token = response.data.loginUser;

      login(token);

      notifications.show({
        title: "Login successful!",
        message: "You have successfully logged in.",
        color: "green",
      });

      window.location.href = "/my-products";
    } catch (err) {
      notifications.show({
        title: "Login failed",
        message: "Invalid email or password. Please try again.",
        color: "red",
      });
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-2 items-center justify-center bg-white">
      <div className="bg-white border border-gray-300 p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
          <TextInput
            placeholder="Email"
            className="w-full"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            placeholder="Password"
            className="w-full"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            size="md"
            type="submit"
            disabled={loading}
            aria-label="Login Button"
            fullWidth
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
          {error && <p className="text-red-500 text-sm">Error: {error.message}</p>}
          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/registration" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
