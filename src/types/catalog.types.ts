export type ItemStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
export type ItemType = "PRODUCT" | "SERVICE";
export type CategoryType = "PRODUCT" | "SERVICE" | "CONTENT";

export interface MediaObject {
  id: string;
  url: string;
  type?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: CategoryType;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  compareAtPrice?: number | string;
  images: string[];
  media: MediaObject[];
  status: ItemStatus;
  itemType: ItemType;
  stock?: number;
  metadata?: Record<string, unknown>;
  categoryId?: string;
  category?: Category;
}

export interface GetItemsParams {
  status?: ItemStatus;
  categoryId?: string;
  itemType?: string;
  search?: string;
  page?: number;
  limit?: number;
}