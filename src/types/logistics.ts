export interface Product {
  _id: string;
  sellerId: string;
  name: string;
  quantity: string;
  suggestedPrice: string;
  status: string;
  createdAt: string;
}

export type OrderStatus = "PLACED" | "PICKUP_SCHEDULED" | "OUT_FOR_DELIVERY" | "DELIVERED";

export interface Order {
  _id: string;
  productId: string;
  productName: string;
  quantity: string;
  sellerId: string;
  buyerName: string;
  phone: string;
  address: string;
  status: OrderStatus | string;
  createdAt: string;
}

export interface BuyPayload {
  productId: string;
  buyerName: string;
  phone: string;
  address: string;
}
