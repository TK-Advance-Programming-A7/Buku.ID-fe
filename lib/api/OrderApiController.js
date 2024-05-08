import { apiClient } from "./ApiClient";

const fetchCount = 10;

export const getOrder = (idOrder) => apiClient.post("/api/v1/order", { idOrder });

export const addOrder = (order) => apiClient.post("/api/v1/order/add", { order });

export const editOrder = (order) => apiClient.patch("/api/v1/order/edit", { order });

export const deleteOrder = (idOrder) => apiClient.delete("/api/v1/order/delete", { idOrder });

export const getAllOrdersOfUser = (idUser) => apiClient.get(`/api/v1/order/users?idUser=${idUser}`);

export const addBookToOrder = (idOrder, idBook, quantity, price) =>
    apiClient.post("/api/v1/order/book/add", { idOrder, idBook, quantity, price });

export const decreaseBookInOrder = (idOrder, idBook, quantity) =>
    apiClient.patch("/api/v1/order/book/decrease", { idOrder, idBook, quantity });

export const nextStatus = (idOrder) => apiClient.patch("/api/v1/order/next", { idOrder });

export const cancelOrder = (idOrder) => apiClient.patch("/api/v1/order/cancel", { idOrder });
