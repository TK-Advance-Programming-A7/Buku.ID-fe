"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar'

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/dashboard/books');
  });


  return <></>
};

export default AdminDashboard;