// Summary component
const CartSummary: React.FC<{ total: string; idOrder: number }> = ({ total, idOrder }) => {
    
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
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">Checkout</button>
        </div>
    );
};

export default CartSummary;
