'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Order, OrderItem } from './types';
import axios from "axios";

const PaymentPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const baseURL = 'http://localhost:8080';

    const fetchOrders = async () => {
        try {
            const userId = "123"; // Example user ID
            const status = "Waiting Payment";
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

    const handleNextStatus = async (orderId: number) => {
        try {
            console.log(`Pay Order: ${orderId}`);
            await axios.patch(`${baseURL}/api/v1/order/next`, { idOrder: orderId});
            fetchOrders();
        } catch (error) {
            console.error('Failed to pay item:', error);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            console.log(`Cancel Order: ${orderId}`);
            await axios.patch(`${baseURL}/api/v1/order/cancel`, { idOrder: orderId});
            fetchOrders();
        } catch (error) {
            console.error('Failed to cancel item:', error);
        }
    };

    return (
        <div className="bg-gray-100 h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4 text-black">Orders Waiting for Payment Page</h1>
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
                                            <p className="text-black font-semibold">Total: {formatRupiah(order.totalPrice)}</p>
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

                                    <div className="flex flex-col md:flex-row items-start mb-4">
                                        <div className="flex-grow">
                                            <button
                                                className="border rounded-md py-2 px-4 ml-2 bg-red-500"
                                                onClick={() => handleCancelOrder(order.idOrder)}
                                                type="button" // Specify type as button
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                        <div className="flex items-start">
                                            <button
                                                className="border rounded-md py-2 px-4 ml-2 bg-green-500"
                                                onClick={() => handleNextStatus(order.idOrder)}
                                                type="submit" // Specify type as button
                                            >
                                                Pay Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PaymentPage;


