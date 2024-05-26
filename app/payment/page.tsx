'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Order, OrderItem } from './types';
import axios from "axios";

const PaymentPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [address, setAddress] = useState('');

    const baseURL = 'http://localhost:8080';

    const [email, setEmail] = useState("");

    const getUserLogin = async () => {
        let value = null;
        try {
            value = localStorage.getItem("token") || "";
            console.log(value);
            if (!value) {
                return;
            }
            const response = await fetch("http://localhost:8081/api/user/me", {
                headers: {
                    Authorization: `Bearer ${value}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setEmail(userData.email); // Set only the email
            }
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };

    const fetchOrders = async () => {
        try {
            const userId = email; // Example user ID
            const status = "Waiting Payment";
            const response = await axios.get(`${baseURL}/api/v1/order/users/status?userId=${userId}&status=${status}`);
            setOrders(response.data);

            if (response.data.length > 0) {
                setAddress(response.data[0].address);
            }

        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };


    useEffect(() => {
        getUserLogin();
        fetchOrders();
    }, []);

    const formatRupiah = (amount: number): string => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        });
        return formatter.format(amount);
    };

    const handleNextStatus = async (
        orderId: number,
        idUser: string,
        address: string,
        items: OrderItem[],
        cancelable: boolean,
        totalPrice: number,
        status: string
    ) => {
        try {
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const editPayload = {
                order: {
                    idOrder: orderId,
                    idUser: idUser,
                    address: address,
                    items: items,
                    cancelable: cancelable,
                    orderDate: currentDate,
                    totalPrice: totalPrice,
                    status: "Waiting Delivered"
                }
            };

            console.log('Sending edit payload:', JSON.stringify(editPayload, null, 2));

            const editResponse = await axios.patch(`${baseURL}/api/v1/order/edit`, editPayload);
            console.log('Edit response:', editResponse.data);

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

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    return (
        <div className="bg-gray-100 h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4 text-black">Orders Waiting for Payment Page</h1>

                {/* Address Input Field */}
                <div className="mb-4 text-black">
                    <label htmlFor="address" className="block text-black font-semibold mb-2">Address:</label>
                    <input
                        type="text"
                        id="address"
                        className={`w-full p-2 border ${address.trim() === '' ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                        value={address}
                        onChange={handleAddressChange}
                    />
                    {address.trim() === '' && (
                        <p className="text-red-500">Address cannot be empty</p>
                    )}
                </div>

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
                                            order.items.sort((a, b) => a.idOrderItem - b.idOrderItem).map(item => (
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
                                                type="button"
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                        <div className="flex items-start">
                                            <button
                                                className="border rounded-md py-2 px-4 ml-2 bg-green-500"
                                                onClick={() => handleNextStatus(
                                                    order.idOrder,
                                                    order.idUser,
                                                    address,  // Use the input address
                                                    order.items,
                                                    order.cancelable,
                                                    order.totalPrice,
                                                    order.status
                                                )}
                                                type="button"
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


