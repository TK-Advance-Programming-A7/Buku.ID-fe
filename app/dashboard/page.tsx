"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardBookList from '@/app/components/DashboardBookList';
import DashboardUserList from '@/app/components/DashboardUserList';

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [showBookPage, setShowBookPage] = useState(true);

  const togglePage = () => {
    setShowBookPage(!showBookPage);
  };

  return (
    <>
      {/* <h3 className='text-white'> WOAIWOAIWO </h3> */}
      <button onClick={togglePage}>
        {showBookPage ? 'View Users' : 'View Books'}
      </button>
      {showBookPage ? <DashboardBookList /> : <DashboardUserList />}
    </>
  );
};

export default AdminDashboard;