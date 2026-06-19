import { useState } from "react";

import { useItems } from "../../hooks/useItems";
import { useCategories } from "../../hooks/useCategories";
import {
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from "../../hooks/useAdminItems";

import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";

import { getErrorMessage } from "../../utils/error";
import type { CatalogItem } from "../../types/catalog.types";
import { Package, Image, AlertCircle } from "lucide-react";

export const ItemsAdminPage = () => {
  const { data: items = [], isLoading } = useItems();
  const { data: categories = [] } = useCategories();
  const [slug, setSlug] = useState<string>("");

  const { mutate: createItem, isPending: creating } = useCreateItem();
  const { mutate: updateItem, isPending: updating } = useUpdateItem();
  const { mutate: deleteItem, isPending: deleting } = useDeleteItem();

  const [formModal, setFormModal] = useState(false);
  const [editTarget, setEditTarget] = useState<CatalogItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setEditTarget(null);
    setSlug("");
    setFormModal(true);
  };

  const openEdit = (item: CatalogItem) => {
    setEditTarget(item);
    setSlug((item as CatalogItem & { slug?: string }).slug ?? "");
    setFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const formData = new FormData(e.currentTarget);

    if (editTarget) {
      updateItem(
        { id: editTarget.id, formData },
        {
          onSuccess: () => setFormModal(false),
          onError: (err) => setFormError(getErrorMessage(err)),
        }
      );
    } else {
      createItem(formData, {
        onSuccess: () => setFormModal(false),
        onError: (err) => setFormError(getErrorMessage(err)),
      });
    }
  };

  const columns = [
    {
      key: "name",
      header: "Item",
      render: (row: CatalogItem) => {
        const image = row.media?.[0]?.url;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/30 overflow-hidden shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted/20">
                  <Package size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{row.name}</p>
              <p className="text-xs text-muted-foreground">{row.category?.name || "Uncategorized"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (row: CatalogItem) => (
        <span className="text-xs font-medium capitalize px-2.5 py-1 rounded-full bg-amber/10 text-amber">
          {row.itemType.toLowerCase()}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row: CatalogItem) => (
        <span className="font-display font-semibold text-amber">
          ₦{Number(row.price).toLocaleString()}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (row: CatalogItem) => {
        // Checking if item is a SERVICE to display appropriate label
        if (row.itemType === "SERVICE") {
          return <span className="text-gray-400 text-sm">—</span>;
        }
        return (
          <span
            className={`text-sm font-medium ${Number(row.stock) === 0 ? "text-red-500 font-semibold" : "text-gray-700"}`}
          >
            {row.stock ?? 0}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: CatalogItem) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (row: CatalogItem) => (
        <div className="flex items-center gap-2 justify-end">
          <Button size="sm" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        label="Admin"
        title="Items"
        description="Manage your product and service catalog"
        action={
          <Button size="sm" onClick={openCreate} className="gap-2">
            <Package size={16} />
            New Item
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        keyExtractor={(i) => i.id}
        emptyMessage="No items found. Create your first item to get started."
      />

      <Modal
        open={formModal}
        onClose={() => setFormModal(false)}
        title={editTarget ? "Edit Item" : "New Item"}
        width="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                name="name"
                defaultValue={editTarget?.name}
                required
                onChange={(e) => {
                  setSlug(
                    e.currentTarget.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  );
                }}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
                placeholder="Enter item name"
              />
            </div>

            <input type="hidden" name="slug" value={slug} />

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editTarget?.description}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 resize-y"
                placeholder="Describe your item..."
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Price (₦) <span className="text-destructive">*</span>
              </label>
              <input
                name="price"
                type="number"
                defaultValue={editTarget ? Number(editTarget.price) : ""}
                required
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
                placeholder="0.00"
              />
            </div>

            {/* Added Stock Input Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue={editTarget ? ((editTarget as any).stock ?? 0) : 0}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                name="itemType"
                defaultValue={editTarget?.itemType ?? "PRODUCT"}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={editTarget?.categoryId ?? ""}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                defaultValue={editTarget?.status ?? "ACTIVE"}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
            </div>

            {/* Images */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Image size={14} className="text-amber" />
                Images
                {editTarget && (
                  <span className="text-xs text-muted-foreground font-normal">
                    (leave empty to keep existing)
                  </span>
                )}
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber file:text-white hover:file:bg-amber-light file:cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload one or more images (JPG, PNG, WEBP)
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setFormModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || updating}
              className="flex-1"
            >
              {creating || updating
                ? "Saving..."
                : editTarget
                ? "Save Changes"
                : "Create Item"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteItem(deleteTarget!.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isPending={deleting}
        variant="danger"
      />
    </div>
  );
};