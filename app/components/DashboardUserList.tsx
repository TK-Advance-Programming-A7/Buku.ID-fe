"use client"

import React, { useEffect, useState } from 'react';
import DashboardNavbar from '@/app/components/DashboardNavbar'
import Modal from 'react-modal';
import Navbar from './navbar';

interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    gender: string;
    role: string;
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/all')
            .then(response => {
                return response.json()
            })
            .then(data => setUsers(data));
    }, []);

    const viewUser = (email: string) => {
        fetch(`http://localhost:8080/api/user/get/${email}`)
        .then(response => response.json())
        .then(user => {
            return setSelectedUser(user);
        })
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#000',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
        },
    };

    return (
        <>
            <Navbar />
            <div className="mx-auto pt-24 container p-4 md:p-6 lg:p-12">
                <div className="w-full p-4">
                    <h2 className="text-2xl text-center font-bold mb-4">Users</h2>
                    <table className="table-auto w-full text-sm">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-800">
                                    <td className="px-4 py-2">{user.fullName}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="flex px-4 py-2 mx-auto">
                                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold mx-auto py-2 px-4 rounded" onClick={() => viewUser(user.email)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                isOpen={selectedUser !== null}
                onRequestClose={() => setSelectedUser(null)}
                style={customStyles}
                contentLabel="User Info"
            >
                {selectedUser && (
                    <>
                        <h2 className="text-2xl text-center font-bold mb-4">User Info</h2>
                        <table className="table-auto w-full text-sm">
                            <tbody>
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <td className="px-4 py-2">{selectedUser.fullName}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Email</th>
                                    <td className="px-4 py-2">{selectedUser.email}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Phone</th>
                                    <td className="px-4 py-2">{selectedUser.phone}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Bio</th>
                                    <td className="px-4 py-2">{selectedUser.bio}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Gender</th>
                                    <td className="px-4 py-2">{selectedUser.gender}</td>
                                </tr>
                                <tr>
                                    <th className="px-4 py-2">Role</th>
                                    <td className="px-4 py-2">{selectedUser.role}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </Modal>
        </>
    );
};

export default AdminDashboard;