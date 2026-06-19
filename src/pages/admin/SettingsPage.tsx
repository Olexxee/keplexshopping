import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";

import {
  getOrganisation,
  updateOrganisation,
} from "../../api/organisation.api";

import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

import { getErrorMessage } from "../../utils/error";

// 1. Updated FIELDS array with required/optional statuses
const FIELDS = [
  { key: "name", label: "Organisation name", type: "text", required: true },
  { key: "slug", label: "Slug / URL Handle", type: "text", required: true },
  { key: "email", label: "Email address", type: "email", required: false },
  { key: "phone", label: "Phone number", type: "tel", required: false },
  { key: "address", label: "Address", type: "text", required: false },
] as const;

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

  // 2. Added slug to the initial state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  // 3. Sync all backend fields to the local form state
  useEffect(() => {
    if (org) {
      setForm({
        name: String(org.name ?? ""),
        slug: String(org.slug ?? ""),
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
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Organisation settings"
        description="Manage your store's public-facing information."
      />

      {isLoading ? (
        <Card className="max-w-xl animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-28 bg-gray-100 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
          <div className="h-10 w-32 bg-gray-100 rounded-xl" />
        </Card>
      ) : (
        <Card className="max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl px-4 py-3">
                <CheckCircle size={15} className="shrink-0" />
                Settings saved successfully.
              </div>
            )}

            {/* 4. Dynamically maps and labels inputs as optional/required */}
            {FIELDS.map(({ key, label, type, required }) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  {!required && (
                    <span className="text-xs text-gray-400 font-normal italic">
                      Optional
                    </span>
                  )}
                </div>
                <input
                  type={type}
                  required={required}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            ))}

            <div className="pt-1">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
