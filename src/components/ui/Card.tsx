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
        "bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-2xl shadow-md",
        paddingStyles[padding],
        hoverable && "transition-all duration-300 hover:shadow-lg hover:border-purple-400 hover:from-white hover:to-pink-50",
        className,
      )}
    >
      {children}
    </div>
  );
};
