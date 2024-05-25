'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Order, OrderItem } from './types';
import axios from "axios";

const CartPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const baseURL = 'http://localhost:8080';

    const fetchOrders = async () => {
        try {
            const userId = 123; // Example user ID
            const status = "Waiting Checkout";
            const response = await axios.get(`${baseURL}/api/v1/order/users/status?userId=${userId}&status=${status}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleDeleteItem = async (orderId: number, itemId: number) => {
        try {
            await axios.delete(`${baseURL}/api/v1/order/book/delete`, { data: { idOrder: orderId, idOrderItem: itemId } });
            fetchOrders();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const handleDecreaseItem = async (orderId: number, bookId: number) => {
        try {
            await axios.patch(`${baseURL}/api/v1/order/book/decrease`, { idOrder: orderId, idBook: bookId, quantity: 1});
            fetchOrders();
        } catch (error) {
            console.error('Failed to decrease item:', error);
        }
    };

    const handleIncreaseItem = async (orderId: number, bookId: number, price: number) => {
        try {
            await axios.post(`${baseURL}/api/v1/order/book/add`, { idOrder: orderId, idBook: bookId, quantity: 1, price: price});
            fetchOrders();
        } catch (error) {
            console.error('Failed to increase item:', error);
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

    const calculateTotal = (): number => {
        return orders.reduce((total, order) => total + order.totalPrice, 0);
    };

    return (
        <div className="bg-gray-100 h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4 text-black">Shopping Page</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-3/4">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <table className="w-full">
                                <thead>
                                <tr>
                                    <th className="text-left font-semibold text-black">Book</th>
                                    <th className="text-left font-semibold text-black">Price</th>
                                    <th className="text-left font-semibold text-black">Quantity</th>
                                    <th className="text-left font-semibold text-black">Total</th>
                                    <th className="text-left font-semibold text-black"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-black">
                                            Your cart is empty.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.flatMap(order =>
                                        order.items.sort((a: OrderItem, b: OrderItem) => a.idOrderItem - b.idOrderItem).map((item: OrderItem) => (
                                            <tr key={item.idOrderItem}>
                                                <td className="py-4 text-black">
                                                    <div className="flex items-center">
                                                        <img className="h-16 w-16 mr-4"
                                                             src="https://via.placeholder.com/150" alt="Product image"/>
                                                        <span className="font-semibold">{item.idBook}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-black">{formatRupiah(item.price)}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center">
                                                        <button className="border rounded-md py-2 px-4 mr-2 text-black"
                                                                onClick={() => handleDecreaseItem(order.idOrder, item.idBook)}>-
                                                        </button>
                                                        <span
                                                            className="text-center w-8 text-black">{item.amount}</span>
                                                        <button className="border rounded-md py-2 px-4 ml-2 text-black"
                                                                onClick={() => handleIncreaseItem(order.idOrder, item.idBook, item.price)}>+
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-black">{formatRupiah(item.totalPrice)}</td>
                                                <td className="py-4 text-black">
                                                    <button type="button" className="ml-2 text-sm px-2 py-1"
                                                            onClick={() => handleDeleteItem(order.idOrder, item.idOrderItem)}>
                                                        <FontAwesomeIcon icon={faTrash}/> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="md:w-1/4 text-black">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4">Summary</h2>
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>{formatRupiah(calculateTotal())}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold">{formatRupiah(calculateTotal())}</span>
                            </div>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;


