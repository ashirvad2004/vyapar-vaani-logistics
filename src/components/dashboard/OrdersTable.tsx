import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/types/logistics";
import { Package, CalendarCheck, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrdersTableProps {
  orders?: Order[];
  isLoading?: boolean;
  isError?: boolean;
}

const ACTION_BUTTONS: Array<{
  status: OrderStatus;
  label: string;
  icon: typeof CalendarCheck;
}> = [
  { status: "PICKUP_PLANNED", label: "Pickup Planned", icon: CalendarCheck },
  { status: "PICKED", label: "Picked", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_ORDER: Record<string, number> = {
  PLACED: 0,
  PICKUP_PLANNED: 1,
  PICKED: 2,
  DELIVERED: 3,
};

const TOAST_MESSAGE: Record<OrderStatus, string> = {
  PLACED: "Marked as placed",
  PICKUP_PLANNED: "📦 Pickup planned — seller notified",
  PICKED: "🚚 Marked as picked — seller notified",
  DELIVERED: "✅ Marked as delivered — seller notified",
};

export function OrdersTable({ orders, isLoading, isError }: OrdersTableProps = {}) {
  const updateStatus = useUpdateOrderStatus();

  const handleAction = (order: Order, status: OrderStatus) => {
    updateStatus.mutate(
      { id: order._id, status },
      {
        onSuccess: () => toast.success(TOAST_MESSAGE[status]),
        onError: () => toast.error("Failed to update status"),
      },
    );
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Package className="h-10 w-10 mb-3 text-destructive/50" />
        <p className="font-medium text-foreground">Failed to load orders</p>
        <p className="text-sm mt-1">Check your backend connection and try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading orders…
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Package className="h-10 w-10 mb-3 opacity-40" />
        <p className="font-medium text-foreground">No orders yet</p>
        <p className="text-sm mt-1">Orders appear here once buyers purchase from the marketplace.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-display font-semibold">Order ID</TableHead>
          <TableHead className="font-display font-semibold">Product</TableHead>
          <TableHead className="font-display font-semibold">Buyer</TableHead>
          <TableHead className="font-display font-semibold">Phone</TableHead>
          <TableHead className="font-display font-semibold">Address</TableHead>
          <TableHead className="font-display font-semibold">Seller</TableHead>
          <TableHead className="font-display font-semibold">Status</TableHead>
          <TableHead className="font-display font-semibold text-right min-w-[320px]">
            Logistics Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const currentRank = STATUS_ORDER[order.status] ?? 0;
          const isPending =
            updateStatus.isPending && updateStatus.variables?.id === order._id;

          return (
            <TableRow key={order._id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {order._id.slice(-8)}
              </TableCell>
              <TableCell className="font-medium capitalize">
                {order.productName}
                <div className="text-xs text-muted-foreground">{order.quantity}</div>
              </TableCell>
              <TableCell>{order.buyerName}</TableCell>
              <TableCell className="font-mono text-xs">{order.phone}</TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {order.address}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {order.sellerId}
              </TableCell>
              <TableCell><StatusBadge status={order.status} /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  {ACTION_BUTTONS.map(({ status, label, icon: Icon }) => {
                    const isCurrent = order.status === status;
                    const isPast = STATUS_ORDER[status] < currentRank;
                    return (
                      <Button
                        key={status}
                        size="sm"
                        variant={isCurrent ? "default" : "outline"}
                        disabled={isPending || isPast || isCurrent}
                        onClick={() => handleAction(order, status)}
                        className={cn(
                          "h-8 text-xs",
                          isPast && "opacity-50",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 mr-1" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
