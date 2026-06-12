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
    <div className="space-y-8 py-8">
      <PageHeader
        label="Account"
        title="Saved Addresses"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-amber-light transition-all duration-200 shadow-amber hover:shadow-glow"
          >
            <Plus size={15} />
            Add address
          </button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-md p-10 text-center">
          <MapPin size={32} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-base font-semibold text-foreground">
            No addresses yet
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add a delivery address to speed up checkout.
          </p>
          <button
            onClick={openCreate}
            className="inline-block mt-5 bg-amber text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-amber-light transition-all duration-200 shadow-amber"
          >
            Add address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-card rounded-xl border shadow-md p-5 relative transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                address.isDefault ? "border-amber" : "border-border"
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-xs font-medium bg-amber text-white px-2.5 py-1 rounded-full">
                  Default
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-amber" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {address.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {address.street}, {address.city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.state}, {address.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => openEdit(address)}
                  className="flex-1 text-center py-2 rounded-lg border border-border text-foreground text-xs font-medium hover:bg-muted hover:text-amber transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(address)}
                  className="flex-1 text-center py-2 rounded-lg border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/10 transition-all duration-200"
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
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
              {formError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Label</label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              required
              placeholder="e.g. Home, Office"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Street</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              required
              placeholder="12 Broad Street"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["city", "state", "country"] as const).map((field) => (
              <div
                key={field}
                className={`space-y-1 ${field === "country" ? "col-span-2" : ""}`}
              >
                <label className="text-sm font-medium text-foreground capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all"
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
              className="w-4 h-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-foreground"
            >
              Set as default address
            </label>
          </div>

          <button
            type="submit"
            disabled={creating || updating}
            className="w-full bg-amber text-white rounded-lg py-2.5 text-sm font-medium hover:bg-amber-light transition-all duration-200 disabled:opacity-50 shadow-amber"
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