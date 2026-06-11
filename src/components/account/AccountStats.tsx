interface AccountStatsProps {
  ordersCount: number;
  addressesCount: number;
}

export const AccountStats = ({
  ordersCount,
  addressesCount,
}: AccountStatsProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{ordersCount}</p>

          <p className="text-sm text-gray-500 mt-1">Orders</p>
        </div>

        <div className="p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{addressesCount}</p>

          <p className="text-sm text-gray-500 mt-1">Addresses</p>
        </div>
      </div>
    </div>
  );
};
