import { useState } from "react";
import {
  useUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
  useCreateStaff,
} from "../../hooks/useAdmin";
import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Modal } from "../../components/ui/Modal";
import { getErrorMessage } from "../../utils/error";
import type { User } from "../../types/auth.types";

const ROLES = ["user", "staff", "admin"];
const STATUSES = ["active", "inactive", "banned"];

export const UsersPage = () => {
  const { data: users = [], isLoading } = useUsers();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: updateStatus } = useUpdateUserStatus();
  const { mutate: createStaff, isPending: creating } = useCreateStaff();

  const [staffModal, setStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" as "staff" | "admin",
  });
  const [formError, setFormError] = useState("");

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    createStaff(staffForm, {
      onSuccess: () => {
        setStaffModal(false);
        setStaffForm({ name: "", email: "", password: "", role: "staff" });
      },
      onError: (err) => setFormError(getErrorMessage(err)),
    });
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: User) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row: User) => (
        <select
          value={row.role}
          onChange={(e) => updateRole({ id: row.id, role: e.target.value })}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white outline-none"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: User & { status?: string }) => (
        <select
          value={row.status ?? "active"}
          onChange={(e) => updateStatus({ id: row.id, status: e.target.value })}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white outline-none"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        label="Admin"
        title="Users"
        action={
          <button
            onClick={() => setStaffModal(true)}
            className="bg-black text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
          >
            + Add staff
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        keyExtractor={(u) => u.id}
        emptyMessage="No users found."
      />

      {/* Create staff modal */}
      <Modal
        open={staffModal}
        onClose={() => setStaffModal(false)}
        title="Add staff member"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {formError}
            </div>
          )}
          {(["name", "email", "password"] as const).map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                      ? "email"
                      : "text"
                }
                value={staffForm[field]}
                onChange={(e) =>
                  setStaffForm((p) => ({ ...p, [field]: e.target.value }))
                }
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              value={staffForm.role}
              onChange={(e) =>
                setStaffForm((p) => ({
                  ...p,
                  role: e.target.value as "staff" | "admin",
                }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {creating ? "Creating..." : "Create staff member"}
          </button>
        </form>
      </Modal>
    </div>
  );
};
