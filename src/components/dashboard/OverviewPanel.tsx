import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order, Product } from "@/types/logistics";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";

interface OverviewPanelProps {
  products: Product[] | undefined;
  orders: Order[];
  isLoading: boolean;
}

export function OverviewPanel({ products, orders, isLoading }: OverviewPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Live Products",
      value: products?.length ?? 0,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Placed",
      value: orders.filter((o) => o.status === "PLACED").length,
      icon: Clock,
      color: "text-warning-foreground",
      bg: "bg-warning/10",
    },
    {
      label: "In Transit",
      value: orders.filter(
        (o) => o.status === "PICKUP_PLANNED" || o.status === "PICKED"
      ).length,
      icon: Truck,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "DELIVERED").length,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-5 px-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
