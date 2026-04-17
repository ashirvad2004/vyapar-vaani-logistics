import { useEffect, useState } from "react";
import { ordersStore } from "@/lib/orders-store";
import type { Order, OrderStatus } from "@/types/logistics";

export function useLocalOrders() {
  const [orders, setOrders] = useState<Order[]>(() => ordersStore.getAll());

  useEffect(() => {
    setOrders(ordersStore.getAll());
    const unsub = ordersStore.subscribe(setOrders);
    return () => {
      unsub();
    };
  }, []);

  return {
    orders,
    addOrder: (o: Order) => ordersStore.add(o),
    updateStatus: (id: string, status: OrderStatus) =>
      ordersStore.updateStatus(id, status),
    removeOrder: (id: string) => ordersStore.remove(id),
  };
}
