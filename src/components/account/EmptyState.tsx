import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyStateProps) => {
  return (
    <div className="py-12 text-center">
      <h3 className="text-base font-medium text-gray-900">{title}</h3>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex mt-6 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};
