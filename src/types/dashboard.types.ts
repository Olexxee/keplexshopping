import type { CatalogItem } from "./catalog.types";
import type { Order } from "./order.types";

export interface DashboardOverview {
  metrics: {
    users: number;
    categories: number;
    items: number;
    orders: number;
    registrations: number;
  };

  revenue: {
    totalRevenue: number;
    successfulPayments: number;
  };

  orders: {
    statusCounts: {
      PENDING: number;
      CONFIRMED: number;
      PROCESSING: number;
      COMPLETED: number;
      CANCELLED: number;
    };

    pending: Order[];
    recent: Order[];
  };

  registrations: {
    statusCounts: {
      PENDING: number;
      PAID: number;
      CANCELLED: number;
      EXPIRED: number;
    };
  };

  payments: {
    statusCounts: {
      PENDING: number;
      SUCCESS: number;
      FAILED: number;
      REVERSED: number;
    };
  };

  inventory: {
    lowStockItems: CatalogItem[];
  };

  topItems: {
    item: CatalogItem | null;
    quantitySold: number;
    revenue: number;
  }[];
}