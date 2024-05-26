import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const CartSummary: React.FC<{ total: string; idOrder: number }> = ({ total, idOrder }) => {
    const baseURL = 'http://localhost:8080';
    const router = useRouter();

    const handleCheckout = async () => {
        try {
            const response = await axios.patch(`${baseURL}/api/v1/order/next`, { idOrder: idOrder });
            console.log(response.data);

            // Redirect the user to the payment page
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
