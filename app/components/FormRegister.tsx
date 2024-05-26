"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "./toast";
import Link from "next/link";

const FormRegister = () => {
  const router = useRouter();
  interface FormData {
    fullName: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER" | "";
    gender: "MALE" | "FEMALE" | "OTHER" | "";
    phone: string;
    bio: string;
  }

  interface FormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    role?: string;
    gender?: string;
    phone?: string;
    bio?: string;
  }
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    gender: "",
    phone: "",
    bio: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email || !validateEmail(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone || !validatePhone(formData.phone))
      newErrors.phone = "Valid phone number is required";
    if (!formData.bio) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8081/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          router.push("/login");
        } else {
          const errorData = await response.json();
          console.log(errorData);
          setToast({
            message: "Registration failed. Please try again.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("An unexpected error happened:", error);
        setToast({
          message: "Registration failed. Please try again.",
          type: "error",
        });
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <ToastContainer />
      <div className="rounded-md -space-y-px">
        <div>
          <label htmlFor="full-name" className="sr-only">
            Full Name
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className={`relative block w-full px-3 py-2 border shadow-sm ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && (
            <p className="mb-2 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
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
            className={`relative block w-full px-3 py-2 border shadow-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="mb-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={`relative block w-full px-3 py-2 border shadow-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="mb-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="role" className="sr-only">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            className={`relative block w-full px-3 py-2 border shadow-sm ${
              errors.role ? "border-red-500" : "border-gray-300"
            } ${
              formData.role == "" ? "text-gray-500" : "text-gray-900"
            } focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
            value={formData.role}
            onChange={handleChange}
          >
            <option value="" disabled>
              Role
            </option>
            <option value="USER" className="text-gray-900">
              USER
            </option>
            <option value="ADMIN" className="text-gray-900">
              ADMIN
            </option>
          </select>
          {errors.role && (
            <p className="mb-2 text-sm text-red-600">{errors.role}</p>
          )}
        </div>
        <div>
          <label htmlFor="gender" className="sr-only">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            className={`relative block w-full px-3 py-2 border shadow-sm ${
              errors.gender ? "border-red-500" : "border-gray-300"
            } ${
              formData.gender == "" ? "text-gray-500" : "text-gray-900"
            } focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
          {errors.gender && (
            <p className="mb-2 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="sr-only">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={`relative block w-full px-3 py-2 border shadow-sm ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="mb-2 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        <div>
          <label htmlFor="bio" className="sr-only">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            required
            className={`relative block w-full px-3 py-2 border ${
              errors.bio ? "border-red-500" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm resize-none`}
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
          {errors.bio && (
            <p className="mb-2 text-sm text-red-600">{errors.bio}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md group hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Register
        </button>
      </div>
      <div className="text-sm text-center text-gray-900">
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-600 hover:text-gray-500 underline"
          >
            Sign in
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

export default FormRegister;
