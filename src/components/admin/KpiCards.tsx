export const KpiCards = ({ overview }: { overview: any }) => {
  const cards = [
    {
      title: "Revenue",
      value: `₦${Number(overview.revenue?.totalRevenue || 0).toLocaleString()}`,
    },
    {
      title: "Orders",
      value: overview.metrics?.orders || 0,
    },
    {
      title: "Users",
      value: overview.metrics?.users || 0,
    },
    {
      title: "Products",
      value: overview.metrics?.items || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-gray-900">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};
