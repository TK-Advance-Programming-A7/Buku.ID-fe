"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../libs/user";
import { useRouter } from "next/navigation";
import Toast from "./toast";
import { AUTH_BASEURL } from "../const";

const ProfileUser = () => {
  const router = useRouter();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [user, setUser] = useState<User>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    gender: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    const getUserLogin = async () => {
      let value = null;
      try {
        value = localStorage.getItem("token") || "";
        console.log(value);
        if (!value) {
          return;
        }
        const response = await fetch(`${AUTH_BASEURL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        });
        if (response.ok) {
          setUser(await response.json());
        }
        return;
      } catch (error) {
        console.error(error);
        return;
      }
    };
    getUserLogin();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!validateEmail(user.email)) {
      setToast({ message: "Invalid email address", type: "error" });
      return;
    }

    if (!validatePhone(user.phone)) {
      setToast({ message: "Invalid phone number", type: "error" });
      return;
    }

    try {
      console.log(user);
      const response = await fetch(`${AUTH_BASEURL}/api/user/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        router.push("/profile");
      } else {
        setToast({
          message: "Edit profile failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
      setToast({
        message: "Edit profile failed. Please try again.",
        type: "error",
      });
    }
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
        <div className="w-full">
          <label
            htmlFor="full-name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full-name"
            name="fullName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 "
            placeholder="Your first name"
            value={`${user?.fullName}` || ""}
            required
            onChange={handleChange} // Add onChange event
          />
        </div>
      </div>

      <div className="mb-2 sm:mb-6">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 "
          placeholder="your.email@mail.com"
          value={`${user?.email}` || ""}
          required
          name="email"
          onChange={handleChange} // Add onChange event
        />
      </div>

      <div className="mb-2 sm:mb-6">
        <label
          htmlFor="profession"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Phone
        </label>
        <input
          type="text"
          id="profession"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 "
          placeholder="+123456789"
          value={`${user?.phone}` || ""}
          required
          name="phone"
          onChange={handleChange} // Add onChange event
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Bio
        </label>
        <textarea
          id="message"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500 "
          placeholder="Write your bio here..."
          value={`${user?.bio}` || ""}
          required
          name="bio"
          onChange={handleChange} // Add onChange event
        ></textarea>
      </div>
      <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
        <div className="w-full">
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Gender
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 "
            placeholder="Your first name"
            value={`${user?.gender}` || ""}
            required
            disabled
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="last_name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Role
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 "
            placeholder="Your last name"
            value={`${user?.role}` || ""}
            required
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="text-white bg-gray-700  hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        >
          Save
        </button>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default ProfileUser;
