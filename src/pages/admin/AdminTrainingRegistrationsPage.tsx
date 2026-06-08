import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { useRegistrations } from "../../hooks/useRegistrations";

export default function AdminTrainingRegistrationsPage() {
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useRegistrations({ status });

  return (
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Training Registrations"
        description="Monitor all training enrollments and payment status"
      />

      {/* FILTERS */}
      <div className="flex gap-3">
        <button onClick={() => setStatus(undefined)} className="btn">
          All
        </button>

        <button onClick={() => setStatus("PENDING")} className="btn">
          Pending
        </button>

        <button onClick={() => setStatus("PAID")} className="btn">
          Paid
        </button>

        <button onClick={() => setStatus("CANCELLED")} className="btn">
          Cancelled
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Program</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Payment Ref</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4" colSpan={7}>
                  Loading...
                </td>
              </tr>
            ) : (
              data?.map((reg: any) => (
                <tr key={reg.id} className="border-b">
                  <td className="p-4 font-medium">{reg.fullName}</td>

                  <td className="p-4">{reg.email}</td>

                  <td className="p-4">{reg.phone}</td>

                  <td className="p-4">{reg.trainingProgram?.title || "—"}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        reg.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : reg.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>

                  <td className="p-4 text-xs text-gray-500">
                    {reg.paymentRef || "—"}
                  </td>

                  <td className="p-4">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
