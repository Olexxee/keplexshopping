import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../../hooks/useAddresses";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { PageHeader } from "../../components/ui/PageHeader";
import { getErrorMessage } from "../../utils/error";
import type { Address, AddressPayload } from "../../types/address.types";

const EMPTY_FORM: AddressPayload = {
  label: "",
  street: "",
  city: "",
  state: "",
  country: "",
  isDefault: false,
};

export const AddressesPage = () => {
  const { data: addresses = [], isLoading } = useAddresses();
  const { mutate: create, isPending: creating } = useCreateAddress();
  const { mutate: update, isPending: updating } = useUpdateAddress();
  const { mutate: remove, isPending: removing } = useDeleteAddress();

  const [formModal, setFormModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressPayload>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormModal(true);
  };

  const openEdit = (address: Address) => {
    setEditTarget(address);
    setForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      isDefault: address.isDefault,
    });
    setFormError("");
    setFormModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (editTarget) {
      update(
        { id: editTarget.id, payload: form },
        {
          onSuccess: () => setFormModal(false),
          onError: (err) => setFormError(getErrorMessage(err)),
        },
      );
    } else {
      create(form, {
        onSuccess: () => setFormModal(false),
        onError: (err) => setFormError(getErrorMessage(err)),
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        label="Account"
        title="Saved Addresses"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus size={15} />
            Add address
          </button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-base font-semibold text-gray-900">
            No addresses yet
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Add a delivery address to speed up checkout.
          </p>
          <button
            onClick={openCreate}
            className="inline-block mt-5 bg-black text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
          >
            Add address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 relative ${
                address.isDefault ? "border-gray-900" : "border-gray-100"
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-xs font-medium bg-gray-900 text-white px-2.5 py-1 rounded-full">
                  Default
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {address.label}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {address.street}, {address.city}
                  </p>
                  <p className="text-sm text-gray-400">
                    {address.state}, {address.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                <button
                  onClick={() => openEdit(address)}
                  className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-medium hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(address)}
                  className="flex-1 text-center py-2 rounded-xl border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={formModal}
        onClose={() => setFormModal(false)}
        title={editTarget ? "Edit address" : "Add address"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {formError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Label</label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              required
              placeholder="e.g. Home, Office"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Street</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              required
              placeholder="12 Broad Street"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["city", "state", "country"] as const).map((field) => (
              <div
                key={field}
                className={`space-y-1 ${field === "country" ? "col-span-2" : ""}`}
              >
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700"
            >
              Set as default address
            </label>
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
                : "Add address"}
          </button>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          remove(deleteTarget!.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        title="Delete address"
        message={`Delete "${deleteTarget?.label}"? This cannot be undone.`}
        confirmLabel="Delete"
        isPending={removing}
        variant="danger"
      />
    </div>
  );
};
