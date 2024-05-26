'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Order, OrderItem } from './types';
import axios from "axios";
import {User} from "@/app/libs/user";

const HistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const baseURL = 'http://localhost:8080';

    const [email, setEmail] = useState("");

    const fetchOrders = async () => {
        let value = null;
        try {
            value = localStorage.getItem("token") || "";
            console.log(value);
            if (!value) {
                return;
            }
            const responseLog = await fetch("http://localhost:8081/api/user/me", {
                headers: {
                    Authorization: `Bearer ${value}`,
                },
            });
            let emailUser = null;
            if (responseLog.ok) {
                const userData = await responseLog.json();
                setEmail(userData.email); // Set only the email
                emailUser = userData.email;
            }

            const userId = emailUser; // Example user ID
            const status = "Waiting Delivered";
            const response = await axios.get(`${baseURL}/api/v1/order/users/status?userId=${userId}&status=${status}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatRupiah = (amount: number): string => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        });
        return formatter.format(amount);
    };

    return (
        <div className="bg-gray-100 h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4 text-black">History Page</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-full">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4 text-center text-black">
                                Your cart is empty.
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.idOrder} className="bg-white rounded-lg shadow-md p-6 mb-4">
                                    <div className="flex flex-col md:flex-row items-start mb-4">
                                        <div className="flex-grow">
                                            <h2 className="text-xl font-semibold mb-1 text-black">Order
                                                ID: {order.idOrder}</h2>
                                            <p className="text-black">Order
                                                Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-start">
                                            <p className="text-black font-semibold">Total: <span
                                                className="font-normal text-gray-700 bg-gray-200 p-2 rounded-md">{formatRupiah(order.totalPrice)}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <table className="w-full mt-4">
                                        <thead>
                                        <tr>
                                            <th className="text-left font-semibold text-black">Book</th>
                                            <th className="text-left font-semibold text-black">Price</th>
                                            <th className="text-left font-semibold text-black">Quantity</th>
                                            <th className="text-left font-semibold text-black">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {order.items.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-black">
                                                    No items in this order.
                                                </td>
                                            </tr>
                                        ) : (
                                            order.items.sort((a: OrderItem, b: OrderItem) => a.idOrderItem - b.idOrderItem).map((item: OrderItem) => (
                                                <tr key={item.idOrderItem}>
                                                    <td className="py-4 text-black">
                                                        <div className="flex items-center">
                                                            <img className="h-16 w-16 mr-4"
                                                                 src="https://via.placeholder.com/150"
                                                                 alt="Product image"/>
                                                            <span className="font-semibold">{item.idBook}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-black">{formatRupiah(item.price)}</td>
                                                    <td className="py-4 text-black">{item.amount}</td>
                                                    <td className="py-4 text-black">{formatRupiah(item.price * item.amount)}</td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                    <h2 className="text-xl font-semibold mb-1 text-black">
                                        Order is sent to: <span
                                        className="font-normal text-gray-700 bg-gray-200 p-2 rounded-md">{order.address}</span>
                                    </h2>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default HistoryPage;


