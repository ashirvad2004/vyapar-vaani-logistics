import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { useLocalOrders } from "@/hooks/use-local-orders";
import type { Order, OrderStatus } from "@/types/logistics";
import { Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const NEXT_STATUS: Record<string, OrderStatus | null> = {
  PLACED: "PICKUP_SCHEDULED",
  PICKUP_SCHEDULED: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
  DELIVERED: null,
};

const NEXT_LABEL: Record<string, string> = {
  PLACED: "Schedule Pickup",
  PICKUP_SCHEDULED: "Out for Delivery",
  OUT_FOR_DELIVERY: "Mark Delivered",
};

interface OrdersTableProps {
  orders?: Order[];
}

export function OrdersTable({ orders: ordersProp }: OrdersTableProps = {}) {
  const { orders: storeOrders, updateStatus } = useLocalOrders();
  const orders = ordersProp ?? storeOrders;

  const handleAdvance = (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    updateStatus(order._id, next);
    toast.success(`Status → ${next.replace(/_/g, " ").toLowerCase()}`);
  };

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
          <TableHead className="font-display font-semibold">Status</TableHead>
          <TableHead className="font-display font-semibold text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const next = NEXT_STATUS[order.status];
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
              <TableCell><StatusBadge status={order.status} /></TableCell>
              <TableCell className="text-right">
                {next ? (
                  <Button size="sm" variant="outline" onClick={() => handleAdvance(order)}>
                    {NEXT_LABEL[order.status]}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <span className="text-xs text-success font-medium">Complete</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
