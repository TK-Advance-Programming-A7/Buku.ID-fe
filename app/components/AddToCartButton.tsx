'use client';

import React, { useState } from 'react';
import AddToCartForm from './AddToCartForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

interface AddToCartButtonProps {
    bookId: number;
    price: number;
    stock: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ bookId, price , stock}) => {
    const [showForm, setShowForm] = useState(false);

    const handleShowForm = () => {
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
    };

    return (
        <div>
            <button onClick={handleShowForm}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded flex items-center">
                <FontAwesomeIcon icon={faCartPlus} className="mr-2"/>
            </button>
            {showForm && <AddToCartForm bookId={bookId} price={price} stock = {stock} onClose={handleFormClose}/>}
        </div>
    );
};

export default AddToCartButton;
