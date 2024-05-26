import React, { useState } from 'react';
import axios from 'axios';

interface AddToCartFormProps {
    bookId: number;
    price: number;
    stock: number;
    onClose: () => void;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({ bookId, price, stock, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [alertMessage, setAlertMessage] = useState("");
    const [showForm, setShowForm] = useState(true); // State to control the visibility of the form

    const baseURL = 'http://localhost:8080';

    const handleIncreaseQuantity = () => {
        if (quantity < stock) { // Check if quantity is less than stock before increasing
            setQuantity(quantity + 1);
        } else {
            setAlertMessage("Cannot add more than available stock.");
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            const userId = "vinka.aeris@gmail.com"; // Example user ID
            const status = "Waiting Checkout";
            const response = await axios.get(`${baseURL}/api/v1/order/users/status?userId=${userId}&status=${status}`);
            const activeOrders = response.data;

            let orderId;

            if (activeOrders.length === 0) {
                const newOrderResponse = await axios.post(`${baseURL}/api/v1/order/add`, {
                    order: {
                        idUser: userId,
                        cancelable: true,
                        status: status
                    }
                });
                orderId = newOrderResponse.data.idOrder;
            } else {
                orderId = activeOrders[0].idOrder;
            }

            // Add item to the cart
            await axios.post(`${baseURL}/api/v1/order/book/add`, { idOrder: orderId, idBook: bookId, quantity: quantity, price: price });

            setQuantity(1);

            setAlertMessage("Item added to cart successfully!");

        } catch (error) {
            console.error('Failed to add item to cart:', error);
            setAlertMessage("Failed to add item to cart. Please try again later.");
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        onClose();
    };

    return (
        showForm && (
            <div className="relative border rounded p-4 text-black">
                <button onClick={handleCloseForm} className="absolute top-0 right-0 p-2">X</button>
                <div className="flex items-center mb-4">
                    <button onClick={handleDecreaseQuantity} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
                        -
                    </button>
                    <span className="bg-gray-100 px-4 py-2">{quantity}</span>
                    <button onClick={handleIncreaseQuantity} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                        +
                    </button>
                </div>
                <button onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add
                </button>
                {alertMessage && (
                    <div className="mt-2 text-green-600">{alertMessage}</div>
                )}
            </div>
        )
    );
};

export default AddToCartForm;