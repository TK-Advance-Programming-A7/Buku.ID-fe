"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Book } from './types';
import { BOOK_BASEURL } from "../const";

const BookPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const booksPerPage = 20;
    const router = useRouter();

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${BOOK_BASEURL}/api/books`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("There was a problem fetching the books:", error);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleBookClick = (idBook: number) => {
        router.push(`/book/${idBook}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
            <div className="w-full fixed top-0 bg-white shadow-md py-4 z-50">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-black">All Books</h1>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded text-black"
                    />
                </div>
            </div>
            <div className="container mx-auto px-4 mt-20">
                {filteredBooks.length === 0 && (
                    <div className="text-center text-black text-lg mt-8 font-bold">
                        Sorry, we can`t find what you`re looking for
                    </div>
                )}
                <div className="flex flex-wrap gap-4 justify-center">
                    {currentBooks.map(book => (
                        <div
                            key={book.idBook}
                            className="bg-white p-3 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/5 transform transition-transform duration-200 hover:-translate-y-2 cursor-pointer"
                            onClick={() => handleBookClick(book.idBook)}
                        >
                            <img src={book.bookPict} alt={book.title} className="w-full h-36 object-cover mb-2 rounded" />
                            <h2 className="text-md font-bold mb-1">{book.title}</h2>
                            <p className="text-gray-700 text-sm mb-1"><span className="font-bold">{book.title}</span></p>
                            <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Author:</span> {book.author}</p>
                            <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Price:</span> ${book.price.toFixed(2)}</p>
                            <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Stock:</span> {book.stock}</p>
                            <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Category:</span> {book.category}</p>
                        </div>
                    ))}
                </div>
                {filteredBooks.length >= 20 && (
                    <div className="flex justify-center items-center mt-8">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 mx-2 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-black-700'} rounded`}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 mx-2 bg-white text-black rounded">{currentPage}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 mx-2 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-black-700'} rounded`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookPage;
