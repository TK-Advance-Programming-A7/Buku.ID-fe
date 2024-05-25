"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Book } from '../types';
import BookForm from "@/app/components/BookForm";

const AddBookPage: React.FC = () => {
    const router = useRouter();
    const baseURL = 'http://localhost:8082';

    const handleSubmit = async (formData: Book) => {
        try {
            const response = await fetch(`${baseURL}/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to add book");
            }
            router.push('/book');
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
            </div>
        </div>
    );
}

export default AddBookPage;
