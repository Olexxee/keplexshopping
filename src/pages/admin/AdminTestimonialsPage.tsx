import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  useAdminTestimonials,
  useTestimonialStats,
  useUpdateTestimonialStatus,
  useDeleteTestimonial,
} from "../../hooks/useTestimonials";

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const statusBadge: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REJECTED: "bg-red-100 text-red-600",
};

export const AdminTestimonialsPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 20,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
  };

  const { data, isLoading } = useAdminTestimonials(params);
  const { data: stats } = useTestimonialStats();
  const updateStatus = useUpdateTestimonialStatus();
  const deleteTestimonial = useDeleteTestimonial();

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    deleteTestimonial.mutate(id);
  };

  const handleStatus = (
    id: string,
    status: "APPROVED" | "REJECTED" | "PENDING",
  ) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader label="Admin" title="Testimonials" />
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "bg-gray-100 text-gray-700",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "bg-yellow-50 text-yellow-700",
            },
            {
              label: "Approved",
              value: stats.approved,
              color: "bg-green-50 text-green-700",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              color: "bg-red-50 text-red-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`rounded-2xl p-4 ${color} border border-black/5`}
            >
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm mt-0.5 opacity-70">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, role, or message..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                status === s
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Person
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Message
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Rating
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-3 w-10 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              ))}

            {!isLoading &&
              data?.items?.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{t.name}</p>
                    {t.role && (
                      <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    <p className="line-clamp-2">{t.message}</p>
                  </td>
                  <td className="px-4 py-3 text-yellow-500">
                    {"★".repeat(t.rating || 5)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {t.status !== "APPROVED" && (
                        <button
                          onClick={() => handleStatus(t.id, "APPROVED")}
                          className="px-3 py-1 rounded-lg text-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {t.status !== "REJECTED" && (
                        <button
                          onClick={() => handleStatus(t.id, "REJECTED")}
                          className="px-3 py-1 rounded-lg text-xs bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      {t.status !== "PENDING" && (
                        <button
                          onClick={() => handleStatus(t.id, "PENDING")}
                          className="px-3 py-1 rounded-lg text-xs bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1 rounded-lg text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!isLoading && !data?.items?.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {data.meta.page} of {data.meta.totalPages} —{" "}
              {data.meta.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.meta.totalPages}
                className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
