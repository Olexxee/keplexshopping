import { cn } from "../../lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
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
        // base
        "relative overflow-hidden rounded-2xl border border-gray-100 bg-white",

        // softer modern shadow (better than purple tint)
        "shadow-sm",

        // smooth interaction
        hoverable &&
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-purple-300",

        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};