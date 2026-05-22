import { useState } from "react";
import { useAllOrders, useUpdateOrderStatus } from "../../hooks/useAdminOrders";
import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import type { Order } from "../../types/order.types";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

export const OrdersAdminPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: orders = [], isLoading } = useAllOrders(
    statusFilter ? { status: statusFilter } : undefined,
  );
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const columns = [
    {
      key: "id",
      header: "Order",
      render: (row: Order) => (
        <div>
          <p className="font-mono text-xs font-medium text-gray-900">
            #{row.id.slice(-10).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(row.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row: Order) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {row.customerName}
          </p>
          {row.customerEmail && (
            <p className="text-xs text-gray-400">{row.customerEmail}</p>
          )}
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (row: Order) => (
        <span className="font-semibold text-sm">
          ₦{Number(row.totalAmount).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Order) => (
        <select
          value={row.status}
          onChange={(e) => updateStatus({ id: row.id, status: e.target.value })}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white outline-none"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (row: Order) => (
        <span className="text-xs text-gray-500">
          {row.items.length} item{row.items.length !== 1 ? "s" : ""}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader label="Admin" title="Orders" />

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {["", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              statusFilter === s
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        keyExtractor={(o) => o.id}
        emptyMessage="No orders found."
      />
    </div>
  );
};
