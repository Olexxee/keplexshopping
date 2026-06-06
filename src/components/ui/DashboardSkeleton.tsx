export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-6 h-32"></div>
        ))}
      </div>

      {/* Order Status Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 h-24"></div>
        ))}
      </div>

      {/* Two Column Skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-2xl p-6 h-96"></div>
        <div className="bg-gray-100 rounded-2xl p-6 h-96"></div>
      </div>

      {/* Top Items Skeleton */}
      <div className="bg-gray-100 rounded-2xl p-6 h-64"></div>
    </div>
  );
};
