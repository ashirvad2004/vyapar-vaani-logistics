import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDeliveryAgents, useAssignDelivery } from "@/hooks/use-orders";
import type { DeliveryAgent, Order } from "@/types/logistics";
import { Truck, Phone, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryAgentsPanelProps {
  assigningOrder: Order | null;
  onAssigned: () => void;
}

const AVAILABILITY_STYLES: Record<string, string> = {
  available: "bg-success/15 text-success border-success/30",
  busy: "bg-warning/15 text-warning-foreground border-warning/30",
  offline: "bg-muted text-muted-foreground border-border",
};

export function DeliveryAgentsPanel({ assigningOrder, onAssigned }: DeliveryAgentsPanelProps) {
  const { data: agents, isLoading, isError } = useDeliveryAgents();
  const assignMutation = useAssignDelivery();

  const handleAssign = async (agent: DeliveryAgent) => {
    if (!assigningOrder) return;
    await assignMutation.mutateAsync({
      order_id: assigningOrder.id,
      agent_id: agent.id,
    });
    onAssigned();
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Truck className="h-10 w-10 mb-3 text-destructive/50" />
        <p className="font-medium text-foreground">Failed to load agents</p>
        <p className="text-sm mt-1">Check your backend connection.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Truck className="h-10 w-10 mb-3 opacity-40" />
        <p className="font-medium text-foreground">No delivery agents</p>
        <p className="text-sm mt-1">Agents will appear once registered in the backend.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assigningOrder && (
        <div className="rounded-lg bg-info/10 border border-info/20 p-3 mb-4">
          <p className="text-sm font-medium text-info">
            Assigning agent for order <span className="font-mono">{assigningOrder.id}</span>
          </p>
        </div>
      )}

      {agents.map((agent) => (
        <Card key={agent.id} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <UserCheck className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{agent.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Phone className="h-3 w-3" />
                  <span>{agent.contact}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("text-xs capitalize", AVAILABILITY_STYLES[agent.availability] ?? "")}
              >
                {agent.availability}
              </Badge>
              {assigningOrder && agent.availability === "available" && (
                <Button
                  size="sm"
                  disabled={assignMutation.isPending}
                  onClick={() => handleAssign(agent)}
                >
                  Assign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
