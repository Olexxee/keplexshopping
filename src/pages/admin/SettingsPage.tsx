import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrganisation,
  updateOrganisation,
} from "../../api/organisation.api";
import { PageHeader } from "../../components/ui/PageHeader";
import { getErrorMessage } from "../../utils/error";

export const SettingsPage = () => {
  const qc = useQueryClient();
  const { data: org, isLoading } = useQuery({
    queryKey: ["organisation"],
    queryFn: getOrganisation,
  });

  const {
    mutate: save,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: updateOrganisation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organisation"] }),
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (org) {
      setForm({
        name: String(org.name ?? ""),
        email: String(org.email ?? ""),
        phone: String(org.phone ?? ""),
        address: String(org.address ?? ""),
      });
    }
  }, [org]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    save(form, { onError: (err) => setError(getErrorMessage(err)) });
  };

  return (
    <div className="space-y-5">
      <PageHeader label="Admin" title="Organisation settings" />

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading settings...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl px-4 py-3">
                Settings saved successfully.
              </div>
            )}

            {(["name", "email", "phone", "address"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  value={form[field]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
