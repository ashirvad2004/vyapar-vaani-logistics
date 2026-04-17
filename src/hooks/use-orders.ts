import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, placeBuyOrder } from "@/lib/api";
import type { BuyPayload } from "@/types/logistics";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    refetchInterval: 15000,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BuyPayload) => placeBuyOrder(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
