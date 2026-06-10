export const OrderStatusCards = ({ statusCounts }: { statusCounts: any }) => {
  if (!statusCounts || Object.keys(statusCounts).length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-200 p-6 text-center">
        <p className="text-purple-600 text-sm font-medium">No order data available</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "from-yellow-300 to-yellow-500 text-white border-yellow-500",
    CONFIRMED: "from-blue-300 to-blue-500 text-white border-blue-500",
    PROCESSING: "from-purple-300 to-purple-500 text-white border-purple-500",
    COMPLETED: "from-green-300 to-green-500 text-white border-green-500",
    CANCELLED: "from-red-300 to-red-500 text-white border-red-500",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(statusCounts).map(([status, count]) => {
        const colorClass = statusColors[status] || "from-gray-300 to-gray-500 text-white border-gray-500";
        return (
          <div
            key={status}
            className={`bg-gradient-to-br ${colorClass} rounded-xl border-2 p-4 transition-all hover:shadow-lg hover:scale-105`}
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">
              {status}
            </p>
            <h3 className="text-3xl font-bold mt-2">
              {count as number}
            </h3>
          </div>
        );
      })}
    </div>
  );
};
