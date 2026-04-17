// Local store for orders placed via /buy.
// The backend currently has no GET /orders endpoint, so we keep a
// session+localStorage mirror of orders as soon as buyers place them.
// As soon as the backend exposes GET /orders, swap this for a real query.

import type { Order, OrderStatus } from "@/types/logistics";

const STORAGE_KEY = "vyapar-vaani-orders";

type Listener = (orders: Order[]) => void;
const listeners = new Set<Listener>();

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  listeners.forEach((l) => l(orders));
}

export const ordersStore = {
  getAll(): Order[] {
    return read();
  },
  add(order: Order) {
    const all = read();
    if (all.some((o) => o._id === order._id)) return;
    write([{ ...order, status: order.status || "PLACED" }, ...all]);
  },
  updateStatus(id: string, status: OrderStatus) {
    write(read().map((o) => (o._id === id ? { ...o, status } : o)));
  },
  remove(id: string) {
    write(read().filter((o) => o._id !== id));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
