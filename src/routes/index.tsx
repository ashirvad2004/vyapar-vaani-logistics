import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { OrderDetailPanel } from "@/components/dashboard/OrderDetailPanel";
import { DeliveryAgentsPanel } from "@/components/dashboard/DeliveryAgentsPanel";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { useOrders } from "@/hooks/use-orders";
import { useSocketSync } from "@/hooks/use-socket";
import type { Order } from "@/types/logistics";
import { Wifi, WifiOff } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Vyapar Vaani — Logistics Dashboard" },
      { name: "description", content: "Real-time logistics management for rural commerce" },
      { property: "og:title", content: "Vyapar Vaani — Logistics Dashboard" },
      { property: "og:description", content: "Real-time logistics management for rural commerce" },
    ],
  }),
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, isError } = useOrders();

  // Socket sync for real-time updates
  useSocketSync();

  const handleAssignAgent = () => {
    if (selectedOrder) {
      setAssigningOrder(selectedOrder);
      setActiveTab("agents");
    }
  };

  const handleAssigned = () => {
    setAssigningOrder(null);
    setActiveTab("orders");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-6 border-b bg-card shrink-0">
          <h2 className="font-display font-bold text-lg capitalize">
            {activeTab === "overview" ? "Dashboard Overview" : activeTab === "agents" ? "Delivery Agents" : "Orders"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="status-pulse inline-block h-2 w-2 rounded-full bg-success" />
            Live
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <OverviewPanel orders={orders} isLoading={isLoading} />
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <OrdersTable
                    orders={orders?.slice(0, 5)}
                    isLoading={isLoading}
                    isError={isError}
                    onSelectOrder={(order) => {
                      setSelectedOrder(order);
                      setActiveTab("orders");
                    }}
                    selectedOrderId={selectedOrder?.id}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              <Card className="lg:col-span-3 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">All Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0 overflow-auto max-h-[calc(100vh-14rem)]">
                  <OrdersTable
                    orders={orders}
                    isLoading={isLoading}
                    isError={isError}
                    onSelectOrder={setSelectedOrder}
                    selectedOrderId={selectedOrder?.id}
                  />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderDetailPanel order={selectedOrder} onAssignAgent={handleAssignAgent} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="max-w-2xl">
              <DeliveryAgentsPanel assigningOrder={assigningOrder} onAssigned={handleAssigned} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
