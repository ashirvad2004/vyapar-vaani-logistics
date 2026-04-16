import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/logistics";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  pickup_scheduled: {
    label: "Pickup Scheduled",
    className: "bg-info/15 text-info border-info/30",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  delivered: {
    label: "Delivered",
    className: "bg-success/15 text-success border-success/30",
  },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
      <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", {
        "bg-warning": status === "pending",
        "bg-info": status === "pickup_scheduled",
        "bg-primary": status === "out_for_delivery",
        "bg-success": status === "delivered",
      })} />
      {config.label}
    </Badge>
  );
}
