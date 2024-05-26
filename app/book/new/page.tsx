"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Book } from '../types';
import BookForm from "@/app/components/BookForm";
import { BOOK_BASEURL } from '@/app/const';

const AddBookPage: React.FC = () => {
    const router = useRouter();

    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = async (formData: Book) => {
        try {
            const response = await fetch(`${BOOK_BASEURL}/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to add book");
            }
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                router.push('/book');
            }, 5000); // Hide popup after 5 seconds and navigate
        } catch (error) {
            console.error("There was a problem adding the book:", error);
        }
    };

    const initialFormData: Book = {
        idBook: 0,
        title: '',
        author: '',
        publisher: '',
        price: 0,
        stock: 0,
        isbn: '',
        bookPict: '',
        publishDate: '',
        category: '',
        page: 0,
        desc: ''
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4 text-black">Add New Book</h1>
                <BookForm initialFormData={initialFormData} onSubmit={handleSubmit} />
                {showPopup && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                        Book added successfully!
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddBookPage;
