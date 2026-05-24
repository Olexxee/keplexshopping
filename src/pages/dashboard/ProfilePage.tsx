import { useState, useEffect } from "react";
import { useMe } from "../../hooks/useAuth";
import { useUpdateProfile } from "../../hooks/useProfile";
import { PageHeader } from "../../components/ui/PageHeader";
import { getErrorMessage } from "../../utils/error";

export const ProfilePage = () => {
  const { data: user } = useMe();
  const {
    mutate: updateProfile,
    isPending,
    isSuccess,
    error,
  } = useUpdateProfile();

  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      setForm({ name: user.fullName, email: user.email });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader label="Account" title="My Profile" />

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        {/* Edit form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Personal information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {getErrorMessage(error)}
              </div>
            )}
            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl px-4 py-3">
                Profile updated successfully.
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* Read-only info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto">
            <span className="text-white text-xl font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="mt-4 text-center">
            <p className="font-semibold text-gray-900">{user?.fullName}</p>
            <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
