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
    "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-100",

  secondary:
    "bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100",

  danger:
    "bg-red-500 text-white hover:bg-red-600",

  outline:
    "border-2 border-pink-300 text-pink-600 hover:bg-pink-50",
};

  const sizes = {
  sm: "px-4 py-2 rounded-xl",
  md: "px-5 py-3 rounded-xl",
  lg: "px-7 py-4 rounded-2xl",
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
