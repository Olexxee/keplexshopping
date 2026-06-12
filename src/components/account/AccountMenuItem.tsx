import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface AccountMenuItemProps {
  title: string;
  badge?: string;
  to?: string;
  disabled?: boolean;
}

export const AccountMenuItem = ({
  title,
  badge,
  to,
  disabled,
}: AccountMenuItemProps) => {
  const content = (
    <>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>

        {badge && (
          <span className="px-2 py-1 text-xs rounded-full bg-black text-white">
            {badge}
          </span>
        )}
      </div>

      {!disabled && (
        <ChevronRight size={16} className="text-gray-400 shrink-0" />
      )}
    </>
  );

  if (disabled) {
    return (
      <div className="flex items-center justify-between px-4 py-4 opacity-60 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to!}
      className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-gray-50 transition"
    >
      {content}
    </Link>
  );
};
