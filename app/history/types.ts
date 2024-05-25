export interface OrderItem {
    idOrderItem: number;
    idBook: number;
    amount: number;
    price: number;
    totalPrice: number;
}

export interface Order {
    idOrder: number;
    idUser: number;
    orderDate: string;
    address: string;
    items: OrderItem[];
    totalPrice: number;
    cancelable: boolean;
    status: string;
}
