export const KpiCards = ({ overview }: { overview: any }) => {
  const cards = [
    {
      title: "Revenue",
      value: `₦${Number(overview.revenue?.totalRevenue || 0).toLocaleString()}`,
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "Orders",
      value: overview.metrics?.orders || 0,
      color: "from-blue-400 to-cyan-500",
    },
    {
      title: "Users",
      value: overview.metrics?.users || 0,
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Products",
      value: overview.metrics?.items || 0,
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-br ${card.color} rounded-2xl border-2 border-white p-6 hover:shadow-xl hover:scale-105 transition-all text-white shadow-lg`}
        >
          <p className="text-sm font-bold opacity-90">{card.title}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};
