"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardBookList from '@/app/components/DashboardBookList';
import DashboardUserList from '@/app/components/DashboardUserList';
import Navbar from '../components/navbar';
import { AUTH_BASEURL } from '../const';

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBookPage, setShowBookPage] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

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
  })

  const togglePage = () => {
    setShowBookPage(!showBookPage);
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto pt-24 container p-4 md:p-6 lg:p-12 bg-black">
        <div className="flex flex-wrap">
          {isAdmin ? (
            <div className="w-full md:w-full xl:w-full p-4">
              <div className='flex justify-between'>
                <h1 className="text-3xl font-bold mb-4 text-white">
                  {showBookPage ? 'List of Books' : 'List of Users'}
                </h1>
                <button
                  onClick={togglePage}
                  className="text-center text-md font-bold mb-4 bg-green-600 hover:bg-gray-800 p-2 rounded text-white"
                >
                  {showBookPage ? (
                    <span>Switch to List of Users</span>
                  ) : (
                    <span>Switch to List of Books</span>
                  )}
                </button>
              </div>
              {showBookPage ? <DashboardBookList /> : <DashboardUserList />}
            </div>
          ) : (<h1 className='text-white py-14 text-2lg'>Not an Admin!</h1>)}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;