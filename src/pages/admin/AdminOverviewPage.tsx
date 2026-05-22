import { useDashboard } from "../../hooks/useDashboard";
import { StatCard } from "../../components/ui/StatCard";
import { PageHeader } from "../../components/ui/PageHeader";

export const AdminOverviewPage = () => {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader label="Admin" title="Overview" />

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading stats...</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard label="Total Users" value={data?.totalUsers ?? 0} />
          <StatCard label="Total Orders" value={data?.totalOrders ?? 0} />
          <StatCard
            label="Total Revenue"
            value={`₦${Number(data?.totalRevenue ?? 0).toLocaleString()}`}
          />
          <StatCard label="Total Items" value={data?.totalItems ?? 0} />
          {data?.pendingOrders !== undefined && (
            <StatCard label="Pending Orders" value={data.pendingOrders} />
          )}
        </div>
      )}
    </div>
  );
};
