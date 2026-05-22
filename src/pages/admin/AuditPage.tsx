import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../../api/audit.api";
import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import type { AuditLog } from "../../api/audit.api";

export const AuditPage = () => {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });

  const columns = [
    {
      key: "action",
      header: "Action",
      render: (row: AuditLog) => (
        <span className="font-mono text-xs font-medium text-gray-900">
          {row.action}
        </span>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      render: (row: AuditLog) => (
        <div>
          <p className="text-xs font-medium text-gray-700 capitalize">
            {row.resource}
          </p>
          {row.resourceId && (
            <p className="text-xs text-gray-400 font-mono">
              {row.resourceId.slice(-8).toUpperCase()}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "userId",
      header: "User",
      render: (row: AuditLog) => (
        <span className="text-xs text-gray-500 font-mono">
          {row.userId ? `...${row.userId.slice(-6)}` : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Time",
      render: (row: AuditLog) => (
        <span className="text-xs text-gray-500">
          {new Date(row.createdAt).toLocaleString("en-NG", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader label="Admin" title="Audit Logs" />
      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        keyExtractor={(l) => l.id}
        emptyMessage="No audit logs found."
      />
    </div>
  );
};
