"use client";

import {useParams, useRouter} from 'next/navigation';
import { useEffect, useState } from "react";
import { Book } from '@/app/book/types';
import BookForm from "@/app/components/BookForm";

const EditBookPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book>();
    const [loading, setLoading] = useState(true);

    const baseURL = 'http://localhost:8082';

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${baseURL}/api/books/${id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setBook(data);
                setLoading(false);
            } catch (error) {
                console.error("There was a problem fetching the book:", error);
            }
        };
        if (id) {
            fetchBook();
        }
    }, [id]);

    const handleUpdateBook = async (formData: Book) => {
        try {
            const response = await fetch(`${baseURL}/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to update book");
            }
            router.push('/book');
        } catch (error) {
            console.error("There was a problem updating the book:", error);
        }
    };

    if (loading) {
        return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!book) {
        return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Book not found</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4 text-black">Edit Book</h1>
                <BookForm initialFormData={book} onSubmit={handleUpdateBook} />
            </div>
        </div>
    );
}

export default EditBookPage;
