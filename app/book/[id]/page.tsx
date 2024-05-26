"use client";

import {useParams, useRouter} from 'next/navigation';
import { useState, useEffect } from 'react';
import { Book } from '../types';
import AddToCartButton from '@/app/components/AddToCartButton';
import { BOOK_BASEURL } from '@/app/const';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            if (id) {
                try {
                    const response = await fetch(`${BOOK_BASEURL}/api/books/${id}`);
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setBook(data);
                    setLoading(false);
                } catch (error) {
                    console.error("There was a problem fetching the book:", error);
                }
            }
        };
        fetchBook();
    }, [id]);

    if (loading) {
        return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!book) {
        return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Book not found</div>;
    }

    const formattedDate = new Date(book.publishDate).toLocaleDateString();

    return (
        <div className="bg-gray-100 min-h-screen py-8 flex items-center justify-center">
            <div className="container mx-auto px-4 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col lg:flex-row">
                    <img src={book.bookPict} alt={book.title} className="w-full lg:w-1/3 h-64 object-cover mb-4 lg:mb-0 lg:mr-8 rounded" />
                    <div className="lg:w-2/3">
                        <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Author:</span> {book.author}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Publisher:</span> {book.publisher}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">ISBN:</span> {book.isbn}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Publish Date:</span> {formattedDate}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Category:</span> {book.category}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Pages:</span> {book.page}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ${book.price.toFixed(2)}</p>
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Stock:</span> {book.stock}</p>
                        <p className="text-gray-700 mb-4"><span className="font-semibold">Description:</span> {book.desc}</p>
                        <AddToCartButton bookId={book.idBook} price={book.price} stock={book.stock} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetailPage;
