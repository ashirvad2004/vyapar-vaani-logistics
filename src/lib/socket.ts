import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

// Socket event names — adjust to match your backend
export const SOCKET_EVENTS = {
  NEW_ORDER: "new-order",
  STATUS_UPDATE: "status-update",
  DELIVERY_ASSIGNED: "delivery-assigned",
  AGENT_UPDATE: "agent-update",
} as const;
