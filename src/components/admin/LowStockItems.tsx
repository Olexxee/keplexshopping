export const LowStockItems = ({ items }: { items: any[] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Low Stock</h2>
        <p className="text-gray-400 text-sm text-center py-8">
          All items well stocked
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-semibold text-lg text-gray-900 mb-4">Low Stock</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span className="text-sm text-gray-700">{item.name}</span>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
              {item.stock} left
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
