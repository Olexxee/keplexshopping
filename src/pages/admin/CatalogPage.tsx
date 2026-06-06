import { useState } from "react";

import { useCategories } from "../../hooks/useCategories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category.api";
import type { CategoryPayload } from "../../api/category.api";

import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Button } from "../../components/ui/Button";

import { getErrorMessage } from "../../utils/error";
import type { Category } from "../../types/catalog.types";

const CATEGORY_TYPES = ["PRODUCT", "SERVICE", "CONTENT"] as const;
const EMPTY_FORM: CategoryPayload = {
  name: "",
  slug: "",
  type: "PRODUCT",
  isActive: true,
  sortOrder: 0,
};

export const CategoriesPage = () => {
  const { data: categories = [], isLoading } = useCategories();
  const qc = useQueryClient();

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setFormModal(false);
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CategoryPayload>;
    }) => updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setFormModal(false);
    },
    onError: (err) => setFormError(getErrorMessage(err)),
  });

  const { mutate: remove, isPending: removing } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setDeleteTarget(null);
    },
  });

  const [formModal, setFormModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryPayload>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      description: cat.description,
      parentId: cat.parentId,
    });
    setFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (editTarget) {
      update({ id: editTarget.id, payload: form });
    } else {
      create(form);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: Category) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-400 font-mono">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row: Category) => (
        <span className="text-xs font-medium capitalize">
          {row.type.toLowerCase()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Active",
      render: (row: Category) => (
        <span
          className={`text-xs font-medium ${
            row.isActive ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          {row.isActive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (row: Category) => (
        <span className="text-xs text-gray-500">{row.sortOrder}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: Category) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button
            variant="danger"
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
    <div className="space-y-5">
      <PageHeader
        label="Admin"
        title="Categories"
        action={
          <Button size="sm" onClick={openCreate}>
            + New category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        keyExtractor={(c) => c.id}
        emptyMessage="No categories yet."
      />

      <Modal
        open={formModal}
        onClose={() => setFormModal(false)}
        title={editTarget ? "Edit category" : "New category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {formError}
            </div>
          )}

          {(["name", "slug", "description"] as const).map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                value={(form as any)[field] ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [field]: e.target.value }))
                }
                required={field !== "description"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    type: e.target.value as typeof form.type,
                  }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
              >
                {CATEGORY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Sort order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.checked }))
              }
              className="w-4 h-4 rounded"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <Button type="submit" fullWidth disabled={creating || updating}>
            {creating || updating
              ? "Saving..."
              : editTarget
                ? "Save changes"
                : "Create category"}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!.id)}
        title="Delete category"
        message={`Delete "${deleteTarget?.name}"? Items in this category will be uncategorized.`}
        confirmLabel="Delete"
        isPending={removing}
        variant="danger"
      />
    </div>
  );
};