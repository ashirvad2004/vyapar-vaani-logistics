import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/logistics";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  PLACED: {
    label: "Placed",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
    dot: "bg-warning",
  },
  PICKUP_SCHEDULED: {
    label: "Pickup Scheduled",
    className: "bg-info/15 text-info border-info/30",
    dot: "bg-info",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    className: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-success/15 text-success border-success/30",
    dot: "bg-success",
  },
};

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PLACED;
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
      <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
}
