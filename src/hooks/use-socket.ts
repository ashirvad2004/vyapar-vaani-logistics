import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, SOCKET_EVENTS } from "@/lib/socket";

export function useSocketSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    socket.on(SOCKET_EVENTS.NEW_ORDER, () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    });

    socket.on(SOCKET_EVENTS.STATUS_UPDATE, () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    });

    socket.on(SOCKET_EVENTS.DELIVERY_ASSIGNED, () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["delivery-agents"] });
    });

    socket.on(SOCKET_EVENTS.AGENT_UPDATE, () => {
      qc.invalidateQueries({ queryKey: ["delivery-agents"] });
    });

    return () => {
      disconnectSocket();
    };
  }, [qc]);
}
