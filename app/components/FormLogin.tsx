"use client";

import { useRouter } from "next/navigation";
import React, { useState, FormEvent, ChangeEvent } from "react";
import Toast from "./toast";
import Link from "next/link";

interface FormLoginProps {
  cookie: any;
}

const FormLogin: React.FC<FormLoginProps> = ({ cookie }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setToast({ message: "Invalid email address", type: "error" });
      return;
    }

    if (password.length < 6) {
      setToast({
        message: "Password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        cookie.set("token", token, {
          path: "/",
          maxAge: 3600,
        });
        router.push("/");
      } else {
        const errorData = await response.json();
        setToast({
          message: errorData.message || "Login failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            onChange={handlePasswordChange}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md group hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Sign in
        </button>
      </div>
      <div className="text-sm text-center text-gray-900">
        <p>
          Dont have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-600 hover:text-gray-500 underline"
          >
            Sign up
          </Link>
        </p>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </form>
  );
};

export default FormLogin;
