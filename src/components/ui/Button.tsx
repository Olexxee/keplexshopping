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
      "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-gray-300 shadow-md hover:shadow-lg hover:scale-105",
    secondary:
      "bg-primary text-white hover:bg-secondary active:bg-primary shadow-md hover:shadow-lg disabled:bg-gray-400",
    danger:
      "bg-danger text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-secondary disabled:border-gray-300 disabled:text-gray-400",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg font-semibold",
    md: "px-4 py-2.5 text-base rounded-lg font-semibold",
    lg: "px-6 py-3.5 text-base rounded-lg font-bold",
  };

  return (
    <button
      {...props}
      className={cn(
        "transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-75",
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
