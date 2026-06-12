import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useChangePassword } from "../../hooks/useChangePassword";

import type { ChangePasswordPayload } from "../../types/profile.types";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const { mutate: changePassword, isPending } = useChangePassword();

  const [form, setForm] = useState<ChangePasswordPayload & { confirmPassword: string }>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onChange = (
    key: keyof (ChangePasswordPayload & { confirmPassword: string }),
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // basic client-side validation
    if (!form.currentPassword || !form.newPassword) {
      setError("All fields are required");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    changePassword(
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
      {
        onSuccess: () => {
          setSuccess(true);

          setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          // optional: delay redirect so user sees success state
          setTimeout(() => {
            navigate("/profile");
          }, 800);
        },
        onError: () => {
          setError("Failed to update password");
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500 mt-1">
          Change your account password
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5"
      >
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl p-3">
            Password updated successfully
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => onChange("currentPassword", e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => onChange("newPassword", e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 rounded-xl text-sm border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-xl text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};
