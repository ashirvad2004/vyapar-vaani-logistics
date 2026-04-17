import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ProductsTable } from "@/components/dashboard/ProductsTable";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { BuyDialog } from "@/components/dashboard/BuyDialog";
import { useProducts } from "@/hooks/use-orders";
import { useLocalOrders } from "@/hooks/use-local-orders";
import type { Product } from "@/types/logistics";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Vyapar Vaani — Logistics Dashboard" },
      { name: "description", content: "Real-time logistics for rural commerce" },
    ],
  }),
});

const TAB_TITLES: Record<string, string> = {
  overview: "Dashboard Overview",
  marketplace: "Marketplace",
  orders: "Logistics Orders",
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);

  const { data: products, isLoading, isError } = useProducts();
  const { orders } = useLocalOrders();

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-14 px-6 border-b bg-card shrink-0">
          <h2 className="font-display font-bold text-lg">
            {TAB_TITLES[activeTab] ?? "Dashboard"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="status-pulse inline-block h-2 w-2 rounded-full bg-success" />
            Connected to backend
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <OverviewPanel products={products} orders={orders} isLoading={isLoading} />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <OrdersTable orders={orders.slice(0, 5)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Live Marketplace</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <ProductsTable
                    products={products?.slice(0, 5)}
                    isLoading={isLoading}
                    isError={isError}
                    onBuy={setBuyingProduct}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "marketplace" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base">All Live Products</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ProductsTable
                  products={products}
                  isLoading={isLoading}
                  isError={isError}
                  onBuy={setBuyingProduct}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base">
                  Logistics Queue ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <OrdersTable />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BuyDialog product={buyingProduct} onClose={() => setBuyingProduct(null)} />
    </div>
  );
}
