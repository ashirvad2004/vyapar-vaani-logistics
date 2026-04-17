import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  placeBuyOrder,
  fetchOrders,
  updateOrderStatus,
  fetchNotifications,
} from "@/lib/api";
import type { BuyPayload, OrderStatus } from "@/types/logistics";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    refetchInterval: 15000,
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 10000,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BuyPayload) => placeBuyOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useNotifications(sellerId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", sellerId],
    queryFn: () => fetchNotifications(sellerId!),
    enabled: !!sellerId,
    refetchInterval: 10000,
  });
}
