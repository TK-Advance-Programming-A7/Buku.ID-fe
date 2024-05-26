'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Order, OrderItem, Book } from './types';
import Navbar from '@/app/components/navbar'
import CartSummary from '@/app/components/CartSummary';
import axios from "axios";
import { AUTH_BASEURL, BOOK_BASEURL, ORDER_BASEURL } from '../const';

const CartPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [books, setBooks] = useState<{ [key: number]: Book }>({});
    const [email, setEmail] = useState("");

    const fetchOrders = async () => {
        let value = null;
        try {
            value = localStorage.getItem("token") || "";
            if (!value) {
                return;
            }
            const responseLog = await fetch(`${AUTH_BASEURL}/api/user/me`, {
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
            const status = "Waiting Checkout";
            const response = await axios.get(`${ORDER_BASEURL}/api/v1/order/users/status`, {
                params: { userId, status },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchBook = async (id: number): Promise<Book | null> => {
        try {
            const response = await axios.get(`${BOOK_BASEURL}/api/books/${id}`);
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

    const handleDeleteItem = async (orderId: number, itemId: number) => {
        try {
            await axios.delete(`${ORDER_BASEURL}/api/v1/order/book/delete`, { data: { idOrder: orderId, idOrderItem: itemId } });
            fetchOrders();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const handleDecreaseItem = async (orderId: number, bookId: number) => {
        try {
            await axios.patch(`${ORDER_BASEURL}/api/v1/order/book/decrease`, { idOrder: orderId, idBook: bookId, quantity: 1 });
            fetchOrders();
        } catch (error) {
            console.error('Failed to decrease item:', error);
        }
    };

    const handleIncreaseItem = async (orderId: number, bookId: number, price: number) => {
        try {
            await axios.post(`${ORDER_BASEURL}/api/v1/order/book/add`, { idOrder: orderId, idBook: bookId, quantity: 1, price: price });
            fetchOrders();
        } catch (error) {
            console.error('Failed to increase item:', error);
        }
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
        <><Navbar />
            <div className="bg-gray-100 h-screen py-8 pt-24">
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
                                            order.items
                                                .sort((a: OrderItem, b: OrderItem) => a.idOrderItem - b.idOrderItem)
                                                .map((item: OrderItem) => {
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
                                                            <td className="py-4 text-black">{formatRupiah(item.price * item.amount)}</td>
                                                            <td className="py-4 text-black">
                                                                <button type="button" className="ml-2 text-sm px-2 py-1"
                                                                        onClick={() => handleDeleteItem(order.idOrder, item.idOrderItem)}>
                                                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="md:w-1/4 text-black">
                            {orders.map(order => (
                                <CartSummary key={order.idOrder} total={formatRupiah(order.totalPrice)}
                                             idOrder={order.idOrder} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
