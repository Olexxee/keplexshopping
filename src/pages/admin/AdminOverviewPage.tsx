import { useDashboard } from "../../hooks/useDashboard";
import { KpiCards } from "../../components/admin/KpiCards";
import { OrderStatusCards } from "../../components/admin/OrderStatusCards";
import { RecentOrdersTable } from "../../components/admin/RecentOrdersTable";
import { LowStockItems } from "../../components/admin/LowStockItems";
import { TopItems } from "../../components/admin/TopItems";
import { PageHeader } from "../../components/ui/PageHeader";
import { DashboardSkeleton } from "../../components/ui/DashboardSkeleton";
import { AlertTriangle } from "lucide-react";

export const AdminOverviewPage = () => {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 py-8">
        <PageHeader label="Admin" title="Overview" />
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 py-8">
        <PageHeader label="Admin" title="Overview" />
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle size={24} className="text-destructive" />
            </div>
            <div>
              <p className="font-medium text-destructive">Failed to load dashboard</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 py-8">
      <PageHeader
        label="Admin"
        title="Overview"
        description="A snapshot of your store's performance."
      />

      {/* KPIs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-amber" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key metrics
          </p>
        </div>
        <KpiCards overview={data} />
      </section>

      {/* Order status */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-amber" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order status
          </p>
        </div>
        <OrderStatusCards statusCounts={data.orders?.statusCounts || {}} />
      </section>

      {/* Recent orders + low stock */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-amber" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent orders
            </p>
          </div>
          <RecentOrdersTable orders={data.orders?.recent || []} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-amber" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Low stock alerts
            </p>
          </div>
          <LowStockItems items={data.inventory?.lowStockItems || []} />
        </div>
      </section>

      {/* Top items */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-amber" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top products
          </p>
        </div>
        <TopItems items={data.topItems || []} />
      </section>
    </div>
  );
};