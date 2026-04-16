import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import type { Order } from "@/types/logistics";
import { Package } from "lucide-react";

interface OrdersTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onSelectOrder: (order: Order) => void;
  selectedOrderId?: string;
}

export function OrdersTable({ orders, isLoading, isError, onSelectOrder, selectedOrderId }: OrdersTableProps) {
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
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Package className="h-10 w-10 mb-3 opacity-40" />
        <p className="font-medium text-foreground">No orders yet</p>
        <p className="text-sm mt-1">Orders will appear here once created in the backend.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-display font-semibold">Order ID</TableHead>
          <TableHead className="font-display font-semibold">Product</TableHead>
          <TableHead className="font-display font-semibold text-right">Qty</TableHead>
          <TableHead className="font-display font-semibold text-right">Price</TableHead>
          <TableHead className="font-display font-semibold">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            className={`cursor-pointer transition-colors ${
              selectedOrderId === order.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectOrder(order)}
          >
            <TableCell className="font-mono text-xs">{order.id}</TableCell>
            <TableCell className="font-medium">{order.product_name}</TableCell>
            <TableCell className="text-right tabular-nums">{order.product_quantity}</TableCell>
            <TableCell className="text-right tabular-nums font-medium">₹{order.product_price}</TableCell>
            <TableCell><StatusBadge status={order.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
