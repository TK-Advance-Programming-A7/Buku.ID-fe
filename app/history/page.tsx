'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import { Order, OrderItem, Book } from './types';

const HistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [books, setBooks] = useState<{ [key: number]: Book }>({});
    const [email, setEmail] = useState('');

    const baseURL = 'http://localhost:8080';

    const fetchOrders = async () => {
        let value = null;
        try {
            value = localStorage.getItem('token') || '';
            if (!value) {
                return;
            }
            const responseLog = await fetch('http://localhost:8081/api/user/me', {
                headers: {
                    Authorization: `Bearer ${value}`,
                },
            });
            let emailUser = null;
            if (responseLog.ok) {
                const userData = await responseLog.json();
                setEmail(userData.email);
                emailUser = userData.email;
            }

            const userId = emailUser;
            const status = 'Waiting Delivered';
            const response = await axios.get(`${baseURL}/api/v1/order/users/status`, {
                params: { userId, status },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchBook = async (id: number): Promise<Book | null> => {
        try {
            const response = await axios.get(`http://localhost:8082/api/books/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch book with id ${id}:`, error);
            return null;
        }
    };

    const fetchBooksForOrders = async (orders: Order[]) => {
        const bookPromises = orders.flatMap(order =>
            order.items.map(item => fetchBook(item.idBook))
        );

        const bookResults = await Promise.all(bookPromises);

        const booksMap: { [key: number]: Book } = {};
        bookResults.forEach(book => {
            if (book) {
                booksMap[book.idBook] = book;
            }
        });

        setBooks(booksMap);
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchOrders();
        };
        initialize();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            fetchBooksForOrders(orders);
        }
    }, [orders]);

    const formatRupiah = (amount: number): string => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        });
        return formatter.format(amount);
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 h-screen py-8 pt-24">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-4 text-black">Order History Page</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-full">
                            {orders.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-6 mb-4 text-center text-black">
                                    Your history is empty.
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.idOrder} className="bg-white rounded-lg shadow-md p-6 mb-4">
                                        <div className="flex flex-col md:flex-row items-start mb-4">
                                            <div className="flex-grow">
                                                <h2 className="text-xl font-semibold mb-1 text-black">
                                                    Order ID: {order.idOrder}
                                                </h2>
                                            </div>
                                            <div className="flex items-start">
                                                <p className="text-black font-semibold">
                                                    Total:{' '}
                                                    <span className="font-normal text-gray-700 bg-gray-200 p-2 rounded-md">
                                                        {formatRupiah(order.totalPrice)}
                                                    </span>
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
                                                order.items
                                                    .sort((a, b) => a.idOrderItem - b.idOrderItem)
                                                    .map(item => {
                                                        const book = books[item.idBook];
                                                        return (
                                                            <tr key={item.idOrderItem}>
                                                                <td className="py-4 text-black">
                                                                    <div className="flex items-center">
                                                                        {book ? (
                                                                            <>
                                                                                <img
                                                                                    className="h-16 w-16 mr-4"
                                                                                    src={book.bookPict}
                                                                                />
                                                                                <span className="font-semibold">
                                                                                        {book.title}
                                                                                    </span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="font-semibold">
                                                                                    Loading...
                                                                                </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 text-black">
                                                                    {formatRupiah(item.price)}
                                                                </td>
                                                                <td className="py-4 text-black">{item.amount}</td>
                                                                <td className="py-4 text-black">
                                                                    {formatRupiah(item.price * item.amount)}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HistoryPage;
