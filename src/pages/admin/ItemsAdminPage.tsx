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
import { getErrorMessage } from "../../utils/error";
import type { CatalogItem } from "../../types/catalog.types";

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
        },
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
            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={row.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  —
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.name}</p>
              <p className="text-xs text-gray-400">{row.category?.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (row: CatalogItem) => (
        <span className="text-xs font-medium capitalize">
          {row.itemType.toLowerCase()}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row: CatalogItem) => (
        <span className="font-medium">
          ₦{Number(row.price).toLocaleString()}
        </span>
      ),
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
          <button
            onClick={() => openEdit(row)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs hover:bg-gray-50 transition"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        label="Admin"
        title="Items"
        action={
          <button
            onClick={openCreate}
            className="bg-black text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
          >
            + New item
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        keyExtractor={(i) => i.id}
        emptyMessage="No items yet."
      />

      {/* Create / Edit modal */}
      <Modal
        open={formModal}
        onClose={() => setFormModal(false)}
        title={editTarget ? "Edit item" : "New item"}
        width="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                defaultValue={editTarget?.name}
                required
                onChange={(e) => {
                  setSlug(
                    e.currentTarget.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  );
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <input type="hidden" name="slug" value={slug} />

            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editTarget?.description}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Price (₦)
              </label>
              <input
                name="price"
                type="number"
                defaultValue={editTarget ? Number(editTarget.price) : ""}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                name="itemType"
                defaultValue={editTarget?.itemType ?? "PRODUCT"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={editTarget?.categoryId ?? ""}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                defaultValue={editTarget?.status ?? "ACTIVE"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Images{" "}
                {editTarget && (
                  <span className="text-gray-400 font-normal">
                    (leave empty to keep existing)
                  </span>
                )}
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating || updating}
            className="w-full bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {creating || updating
              ? "Saving..."
              : editTarget
                ? "Save changes"
                : "Create item"}
          </button>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteItem(deleteTarget!.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        title="Delete item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isPending={deleting}
        variant="danger"
      />
    </div>
  );
};
