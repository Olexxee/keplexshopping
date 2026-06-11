interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
}

export const StatCard = ({ label, value, sub }: StatCardProps) => (
  <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl border-2 border-gradient-to-r from-purple-200 to-pink-200 shadow-lg p-6 hover:shadow-xl transition-all duration-200">
    <p className="text-sm font-medium text-purple-600">{label}</p>
    <h2 className="text-4xl font-bold mt-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{value}</h2>
    {sub && <p className="text-xs text-cyan-600 mt-1 font-medium">{sub}</p>}
  </div>
);
