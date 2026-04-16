import axios from "axios";
import type {
  Order,
  Seller,
  Buyer,
  DeliveryAgent,
  AssignDeliveryPayload,
  UpdateStatusPayload,
} from "@/types/logistics";

// ⚠️ CHANGE THIS to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Orders
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders");
  return Array.isArray(data) ? data : data.orders ?? data.data ?? [];
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order ?? data.data ?? data;
};

// Sellers
export const fetchSellerById = async (id: string): Promise<Seller> => {
  const { data } = await api.get(`/sellers/${id}`);
  return data.seller ?? data.data ?? data;
};

// Buyers
export const fetchBuyerById = async (id: string): Promise<Buyer> => {
  const { data } = await api.get(`/buyers/${id}`);
  return data.buyer ?? data.data ?? data;
};

// Delivery Agents
export const fetchDeliveryAgents = async (): Promise<DeliveryAgent[]> => {
  const { data } = await api.get("/delivery-agents");
  return Array.isArray(data) ? data : data.agents ?? data.data ?? [];
};

// Assign delivery
export const assignDelivery = async (payload: AssignDeliveryPayload): Promise<Order> => {
  const { data } = await api.post("/assign-delivery", payload);
  return data.order ?? data.data ?? data;
};

// Update status
export const updateOrderStatus = async (payload: UpdateStatusPayload): Promise<Order> => {
  const { data } = await api.patch("/update-status", payload);
  return data.order ?? data.data ?? data;
};

export { api, API_BASE_URL };
