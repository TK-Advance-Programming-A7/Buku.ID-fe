'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from "next/navigation";
import { faBook, faChartLine, faShoppingCart, faCreditCard, faHistory, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AUTH_BASEURL } from "../const";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate an API call to check if the user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    fetch(`${AUTH_BASEURL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => response.json())
      .then(data => {
        if (data.role === 'ADMIN') {
          setIsAdmin(true);
        }
      });
  }, []);

  const handleLogout = () => {
    // Simulate logging out
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
      <nav id="header" className="fixed w-full z-30 top-0 text-white bg-black">
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
          <div className="pl-4 flex items-center">
            <Link
                className="toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
                href="#"
            >
              Buku.ID
            </Link>
          </div>
          <div className="block lg:hidden pr-4">
            <button
                id="nav-toggle"
                className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              <svg
                  className="fill-current h-6 w-6"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div
              className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
              id="nav-content"
          >
            {isLoggedIn ? (
                <ul className="list-reset lg:flex justify-end flex-1 items-center">
                  {isAdmin? 
                  <li className="mr-3">
                    <Link
                      className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                      href="/dashboard"
                    >
                      <FontAwesomeIcon icon={faChartLine} className="mr-1" /> Dashboard
                    </Link>
                  </li> : <></>
                  }
                  <li className="mr-3">
                    <Link
                        className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                        href="/book"
                    >
                      <FontAwesomeIcon icon={faBook} className="mr-1"/> Book
                    </Link>
                  </li>
                  <li className="mr-3">
                    <Link
                        className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                        href="/cart"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-1"/> Cart
                    </Link>
                  </li>
                  <li className="mr-3">
                    <Link
                        className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                        href="/payment"
                    >
                      <FontAwesomeIcon icon={faCreditCard} className="mr-1"/> Payment
                    </Link>
                  </li>
                  <li className="mr-3">
                    <Link
                        className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                        href="/history"
                    >
                      <FontAwesomeIcon icon={faHistory} className="mr-1"/> History
                    </Link>
                  </li>
                  <li className="mr-3">
                    <button
                        className="mx-auto lg:mx-0 hover:underline bg-white text-black font-bold rounded-full mt-4 lg:mt-0 py-1 px-4 focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out"
                        onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-1"/> Logout
                    </button>
                  </li>
                </ul>
            ) : (
                <ul className="list-reset lg:flex justify-end flex-1 items-center">
                  <li className="mr-3">
                    <Link
                        className="inline-block text-white no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                        href="#"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-1"/> Link
                    </Link>
                  </li>
                  <li className="mr-3">
                    <Link
                        id="navAction"
                        href="/login"
                        className="mx-auto lg:mx-0 hover:underline bg-white text-black font-bold rounded-full mt-4 lg:mt-0 py-1 px-4 focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-1"/> Login
                    </Link>
                  </li>
                </ul>
              )}
          </div>
        </div>
        <hr className="border-b border-gray-100 opacity-25 my-0 py-0"/>
      </nav>
  );
};

export default Navbar;
