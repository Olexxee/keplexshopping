export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItemProduct {
  id: string;
  name: string;
  media: { id: string; url: string }[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPriceSnapshot: number | string;
  totalPrice: number | string;
  item: OrderItemProduct;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number | string;
  createdAt: string;
  items: OrderItem[];
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  addressId?: string;
}

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  addressId?: string;
}
