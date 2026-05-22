const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  processing: "bg-purple-50 text-purple-700 border-purple-100",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles =
    statusStyles[status.toLowerCase()] ??
    "bg-gray-50 text-gray-600 border-gray-100";
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${styles}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
