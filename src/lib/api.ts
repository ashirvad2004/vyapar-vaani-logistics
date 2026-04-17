import axios from "axios";
import type { Product, Order, BuyPayload, OrderStatus, Notification } from "@/types/logistics";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://vyapar-vaani.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Marketplace products (LIVE listings from sellers)
export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products");
  return Array.isArray(data) ? data : [];
};

// Place an order (buyer info passed to logistics)
export const placeBuyOrder = async (payload: BuyPayload): Promise<Order> => {
  const { data } = await api.post("/buy", payload);
  return data.order;
};

// Logistics: fetch all orders
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders");
  return Array.isArray(data) ? data : [];
};

// Logistics: update order status (also creates seller notification on backend)
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<Order> => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
};

// Seller notifications (chat updates)
export const fetchNotifications = async (sellerId: string): Promise<Notification[]> => {
  const { data } = await api.get(`/notifications/${sellerId}`);
  return Array.isArray(data) ? data : [];
};

export { api, API_BASE_URL };
