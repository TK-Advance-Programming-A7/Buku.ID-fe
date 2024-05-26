export interface OrderItem {
    idOrderItem: number;
    idBook: number;
    amount: number;
    price: number;
    totalPrice: number;
}

export interface Order {
    idOrder: number;
    idUser: string;
    orderDate: string;
    address: string;
    items: OrderItem[];
    totalPrice: number;
    cancelable: boolean;
    status: string;
}

export interface Book {
    idBook: number;
    title: string;
    author: string;
    publisher: string;
    price: number;
    stock: number;
    isbn: string;
    bookPict: string;
    publishDate: string;
    category: string;
    page: number;
    desc: string;
}
