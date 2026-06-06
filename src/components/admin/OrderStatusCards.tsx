export const OrderStatusCards = ({ statusCounts }: { statusCounts: any }) => {
  if (!statusCounts || Object.keys(statusCounts).length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <p className="text-gray-400 text-sm">No order data available</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 border-yellow-200",
    CONFIRMED: "bg-blue-50 border-blue-200",
    PROCESSING: "bg-purple-50 border-purple-200",
    COMPLETED: "bg-green-50 border-green-200",
    CANCELLED: "bg-red-50 border-red-200",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div
          key={status}
          className={`bg-white rounded-xl border p-4 transition-all hover:shadow-md ${statusColors[status] || "border-gray-200"}`}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {status}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {count as number}
          </h3>
        </div>
      ))}
    </div>
  );
};
