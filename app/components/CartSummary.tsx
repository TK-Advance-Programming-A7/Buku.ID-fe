"use client"; // Make sure this is at the very top of the file

import React from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { AUTH_BASEURL, BOOK_BASEURL, ORDER_BASEURL } from '../const';

interface OrderItem {
    idOrderItem: number;
    idBook: number;
    amount: number;
    price: number;
    totalPrice: number;
}

interface Order {
    idOrder: number;
    idUser: string;
    orderDate: string;
    address: string;
    items: OrderItem[];
    totalPrice: number;
    cancelable: boolean;
    status: string;
}

interface Book {
    idBook: number;
    title: string;
    author: string;
    publisher: string;
    price: number;
    stock: number;
    isbn: string;
    bookPict: string;
    publishDate: string;
    category: string;
    page: number;
    desc: string;
}

interface Props {
    total: string;
    idOrder: number;
    orders: Order[];
    books: { [key: number]: Book }; // Menggunakan objek untuk mewakili koleksi buku
}
const CartSummary: React.FC<Props> = ({ total, idOrder, orders, books }) => {
    const router = useRouter();
    const baseURL = `${ORDER_BASEURL}`;

    const handleCheckout = async () => {
        try {
            // Verifikasi stok buku sebelum checkout
            let insufficientStock = false;
            orders.forEach(order => {
                order.items.forEach(item => {
                    const book = books[item.idBook];
                    if (book && book.stock < item.amount) {
                        insufficientStock = true;
                    }
                });
            });

            if (insufficientStock) {
                console.error('Insufficient stock for one or more items.');
                // Tampilkan pesan kesalahan atau lakukan tindakan yang sesuai
                return;
            }

            // Lakukan checkout jika stok cukup
            await axios.patch(`${ORDER_BASEURL}/api/v1/order/next`, { idOrder: idOrder });

            // Kurangi stok buku
            await Promise.all(orders.map(async order => {
                await Promise.all(order.items.map(async item => {
                    try {
                        await axios.post(`${BOOK_BASEURL}/api/books/decreaseStock/${item.idBook}/${item.amount}`);
                    } catch (error) {
                        console.error(`Failed to decrease stock for book ${item.idBook}:`, error);
                    }
                }));
            }));

            // Redirect pengguna ke halaman pembayaran
            router.push('/payment');
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{total}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{total}</span>
            </div>
            <button onClick={handleCheckout} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">
                Checkout
            </button>
        </div>
    );
};

export default CartSummary;
