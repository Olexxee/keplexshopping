import type { ReactNode } from "react";
import clsx from "clsx";

interface AccountCardProps {
  children: ReactNode;
  className?: string;
}

export const AccountCard = ({ children, className }: AccountCardProps) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-gray-100 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};
