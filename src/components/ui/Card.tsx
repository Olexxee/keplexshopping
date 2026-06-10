import { cn } from "../../lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = ({
  children,
  className,
  hoverable = false,
  padding = "md",
}: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-2xl shadow-sm",
        paddingStyles[padding],
        hoverable && "transition-all duration-300 hover:shadow-lg hover:border-brand-200 hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
};