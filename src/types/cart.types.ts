import type { CatalogItem } from "./catalog.types";

export interface CartItemProduct {
  id: string;
  name: string;
  media: { id: string; url: string }[];
}

export interface CartItem {
  id: string;
  itemId: string; // used for update/remove API calls
  quantity: number;
  unitPriceSnapshot: number | string; // price at time of adding
  lineTotal: number | string; // quantity × unitPriceSnapshot
  item: CartItemProduct;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number | string;
}
