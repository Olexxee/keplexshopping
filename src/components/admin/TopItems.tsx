export const TopItems = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">
          Top Selling Products
        </h2>
        <p className="text-gray-400 text-sm text-center py-8">
          No sales data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-semibold text-lg text-gray-900 mb-4">
        Top Selling Products
      </h2>
      <div className="space-y-3">
        {items.slice(0, 5).map((entry, index) => (
          <div
            key={entry.item?.id || index}
            className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-6">
                #{index + 1}
              </span>
              <span className="text-sm text-gray-700">
                {entry.item?.name || "Unknown Product"}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
              {entry.quantitySold} sold
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
