export interface Order {
  id: string;
  product_name: string;
  product_quantity: number;
  product_price: number;
  seller_id: string;
  buyer_id: string;
  status: OrderStatus;
  assigned_agent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus =
  | "pending"
  | "pickup_scheduled"
  | "out_for_delivery"
  | "delivered";

export interface Seller {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Buyer {
  id: string;
  name: string;
  contact: string;
  delivery_address: string;
  ordered_quantity?: number;
  final_price?: number;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  contact: string;
  availability: "available" | "busy" | "offline";
}

export interface AssignDeliveryPayload {
  order_id: string;
  agent_id: string;
}

export interface UpdateStatusPayload {
  order_id: string;
  status: OrderStatus;
}
