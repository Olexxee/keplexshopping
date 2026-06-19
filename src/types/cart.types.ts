export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  status: string;

  media: {
    id: string;
    url: string;
  }[];
}

export interface CartItem {
  id: string;
  itemId: string;

  quantity: number;

  unitPrice: number;
  lineTotal: number;

  availableStock: number;
  inStock: boolean;
  unavailable: boolean;

  item: CartItemProduct;
}

export interface Cart {
  id: string;
  status: string;
  userId: string;

  items: CartItem[];

  subtotal: number;
  totalItems: number;

  createdAt: string;
  updatedAt: string;
}
