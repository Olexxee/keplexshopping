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

const FIELDS = [
  { key: "name", label: "Organisation name", type: "text" },
  { key: "email", label: "Email address", type: "email" },
  { key: "phone", label: "Phone number", type: "tel" },
  { key: "address", label: "Address", type: "text" },
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
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Organisation settings"
        description="Manage your store's public-facing information."
      />

      {isLoading ? (
        <Card className="max-w-xl animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
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

            {FIELDS.map(({ key, label, type }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
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
