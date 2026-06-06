import type { ReactNode } from "react";

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

export interface Payment {
  id: string;
  reference: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "ABANDONED" | "REVERSED";

  authorizationUrl?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPriceSnapshot: number;
  totalPrice: number;
  item: OrderItemProduct;
}

export interface Order {
  shippingLabel: import("react/jsx-runtime").JSX.Element;
  address: any;
  shippingStreet: ReactNode;
  shippingCity: ReactNode;
  shippingState: ReactNode;
  shippingCountry: ReactNode;
  id: string;
  status: OrderStatus;
  totalAmount: number | string;

  customerName: string;
  customerEmail?: string;
  customerPhone?: string;

  notes?: string;

  createdAt: string;

  items: OrderItem[];

  payments?: Payment[];
}

export interface PaginatedOrders {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CheckoutPayload {
  addressId: string;
  notes?: string;
}