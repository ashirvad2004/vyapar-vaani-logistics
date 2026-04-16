import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { useSeller, useBuyer, useUpdateStatus } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/types/logistics";
import { User, Phone, MapPin, Package, ArrowRight } from "lucide-react";

interface OrderDetailPanelProps {
  order: Order | null;
  onAssignAgent: () => void;
}

const STATUS_FLOW: { from: OrderStatus; to: OrderStatus; label: string }[] = [
  { from: "pending", to: "pickup_scheduled", label: "Assign Pickup" },
  { from: "pickup_scheduled", to: "out_for_delivery", label: "Out for Delivery" },
  { from: "out_for_delivery", to: "delivered", label: "Mark Delivered" },
];

function PersonCard({ title, name, phone, address, isLoading }: {
  title: string; name?: string; phone?: string; address?: string; isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      <div className="flex items-center gap-2 text-sm">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{name || "—"}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-3.5 w-3.5" />
        <span>{phone || "—"}</span>
      </div>
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>{address || "—"}</span>
      </div>
    </div>
  );
}

export function OrderDetailPanel({ order, onAssignAgent }: OrderDetailPanelProps) {
  const { data: seller, isLoading: sellerLoading } = useSeller(order?.seller_id);
  const { data: buyer, isLoading: buyerLoading } = useBuyer(order?.buyer_id);
  const updateStatus = useUpdateStatus();

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
        <Package className="h-12 w-12 mb-3 opacity-30" />
        <p className="font-display font-semibold text-foreground">Select an order</p>
        <p className="text-sm mt-1">Click on an order to view details</p>
      </div>
    );
  }

  const nextStatus = STATUS_FLOW.find((s) => s.from === order.status);

  return (
    <div className="space-y-4">
      {/* Order header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
          <h3 className="font-display font-bold text-lg mt-0.5">{order.product_name}</h3>
          <p className="text-sm text-muted-foreground">
            Qty: {order.product_quantity} · ₹{order.product_price}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* People */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4 px-4">
            <PersonCard
              title="Seller"
              name={seller?.name}
              phone={seller?.phone}
              address={seller?.address}
              isLoading={sellerLoading}
            />
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4 px-4">
            <PersonCard
              title="Buyer"
              name={buyer?.name}
              phone={buyer?.contact}
              address={buyer?.delivery_address}
              isLoading={buyerLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {order.status !== "delivered" && !order.assigned_agent_id && (
          <Button onClick={onAssignAgent} variant="outline" className="w-full">
            <Truck className="mr-2 h-4 w-4" />
            Assign Delivery Agent
          </Button>
        )}

        {nextStatus && (
          <Button
            className="w-full"
            disabled={updateStatus.isPending}
            onClick={() =>
              updateStatus.mutate({ order_id: order.id, status: nextStatus.to })
            }
          >
            {updateStatus.isPending ? "Updating…" : nextStatus.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Need Truck import
import { Truck } from "lucide-react";
