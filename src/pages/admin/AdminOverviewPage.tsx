import { useDashboard } from "../../hooks/useDashboard";
import { KpiCards } from "../../components/admin/KpiCards";
import { OrderStatusCards } from "../../components/admin/OrderStatusCards";
import { RecentOrdersTable } from "../../components/admin/RecentOrdersTable";
import { LowStockItems } from "../../components/admin/LowStockItems";
import { TopItems } from "../../components/admin/TopItems";
import { PageHeader } from "../../components/ui/PageHeader";
import { DashboardSkeleton } from "../../components/ui/DashboardSkeleton";

export const AdminOverviewPage = () => {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader label="Admin" title="Overview" />
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader label="Admin" title="Overview" />
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="font-medium text-red-600">Failed to load dashboard</p>
          <p className="text-sm text-red-400 mt-1">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        label="Admin"
        title="Overview"
        description="A snapshot of your store's performance."
      />

      {/* KPIs */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Key metrics
        </p>
        <KpiCards overview={data} />
      </section>

      {/* Order status */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Order status
        </p>
        <OrderStatusCards statusCounts={data.orders?.statusCounts || {}} />
      </section>

      {/* Recent orders + low stock */}
      <section className="grid lg:grid-cols-2 gap-6">
        <RecentOrdersTable orders={data.orders?.recent || []} />
        <LowStockItems items={data.inventory?.lowStockItems || []} />
      </section>

      {/* Top items */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Top products
        </p>
        <TopItems items={data.topItems || []} />
      </section>
    </div>
  );
};
