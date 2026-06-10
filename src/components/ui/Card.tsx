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
        "bg-white border border-pink-100 rounded-3xl shadow-sm",
        paddingStyles[padding],
        hoverable && "transition-all duration-200 ] hover:border-pink-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
};
