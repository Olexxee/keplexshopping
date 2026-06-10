import { cn } from "../../lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 shadow-sm",
    secondary:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl",
  };

  return (
    <button
      {...props}
      className={cn(
        "font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
};
