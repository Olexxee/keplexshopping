const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 font-semibold",
  confirmed: "bg-blue-100 text-blue-800 border-2 border-blue-300 font-semibold",
  processing: "bg-purple-100 text-purple-800 border-2 border-purple-300 font-semibold",
  shipped: "bg-indigo-100 text-indigo-800 border-2 border-indigo-300 font-semibold",
  delivered: "bg-green-100 text-green-800 border-2 border-green-300 font-semibold",
  completed: "bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-semibold",
  cancelled: "bg-red-100 text-red-800 border-2 border-red-300 font-semibold",
  expired: "bg-gray-200 text-gray-700 border-2 border-gray-400 font-semibold",
  success: "bg-green-100 text-green-800 border-2 border-green-300 font-semibold",
  failed: "bg-red-100 text-red-800 border-2 border-red-300 font-semibold",
  reversed: "bg-orange-100 text-orange-800 border-2 border-orange-300 font-semibold",
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const styles =
    statusStyles[status.toLowerCase()] ??
    "bg-gray-50 text-gray-600 border-gray-200";

  const sizes = {
    sm: "text-xs px-2 py-0.5 rounded-full",
    md: "text-xs font-medium px-2.5 py-1 rounded-full",
  };

  return (
    <span className={`inline-block border ${styles} ${sizes[size]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};
