"use client"

import React, { useEffect, useState } from 'react';
import DashboardNavbar from '@/app/components/DashboardNavbar'
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/navbar';

interface Book {
  idBook: number,
  title: string,
  author: string,
  publisher: string,
  price: number,
  stock: number,
  isbn: string,
  bookPict: string,
  publishDate: string,
  category: string,
  page: string,
  desc: string
}

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch books
    fetch('http://localhost:8081/api/books')
      .then(response => {
        return response.json()
      })
      .then(data => setBooks(data));

  }, []);

  const editBook = (id: number) => {
    router.push(`/book/edit/${id}`);
  };

  const deleteBook = (id: number) => {
    fetch(`http://localhost:8081/api/books/${id}`, {
      method: 'DELETE',
    }).then(response => {
      if (response.status === 204) {
        alert('Book Deleted Successfully');
        location.reload();
      } else {
        alert(`Error on deletion, status code ${response.status}`);
      }
    }).catch(error => {
      console.error('Error during fetch operation:', error);
    });
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto pt-24 container p-4 md:p-6 lg:p-12">
        <div className="flex flex-wrap ">
          <div className="w-full md:w-full xl:w-full p-4">
            <h2 className="text-center text-2xl font-bold mb-4">Books</h2>
            <table className="table-auto w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Writer</th>
                  <th className="px-4 py-2">Publisher</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.isbn} className="hover:bg-gray-800">
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.publisher}</td>
                    <td className="px-4 py-2">{book.price}</td>
                    <td className="flex px-4 py-2">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 mx-2 rounded" onClick={() => editBook(book.idBook)}>
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mx-2 rounded" onClick={() => deleteBook(book.idBook)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;