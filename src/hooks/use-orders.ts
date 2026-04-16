import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrders,
  fetchSellerById,
  fetchBuyerById,
  fetchDeliveryAgents,
  assignDelivery,
  updateOrderStatus,
} from "@/lib/api";
import type { AssignDeliveryPayload, UpdateStatusPayload } from "@/types/logistics";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 30000,
  });
}

export function useSeller(id: string | undefined) {
  return useQuery({
    queryKey: ["seller", id],
    queryFn: () => fetchSellerById(id!),
    enabled: !!id,
    staleTime: 60000,
  });
}

export function useBuyer(id: string | undefined) {
  return useQuery({
    queryKey: ["buyer", id],
    queryFn: () => fetchBuyerById(id!),
    enabled: !!id,
    staleTime: 60000,
  });
}

export function useDeliveryAgents() {
  return useQuery({
    queryKey: ["delivery-agents"],
    queryFn: fetchDeliveryAgents,
    refetchInterval: 15000,
  });
}

export function useAssignDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignDeliveryPayload) => assignDelivery(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["delivery-agents"] });
    },
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStatusPayload) => updateOrderStatus(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
