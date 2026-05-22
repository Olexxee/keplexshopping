interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
}

export const StatCard = ({ label, value, sub }: StatCardProps) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
    <p className="text-sm text-gray-500">{label}</p>
    <h2 className="text-3xl font-bold mt-3">{value}</h2>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);
