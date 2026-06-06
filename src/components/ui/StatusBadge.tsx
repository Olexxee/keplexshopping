const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-gray-50 text-gray-600 border-gray-200",
  success: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  reversed: "bg-orange-50 text-orange-700 border-orange-200",
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
