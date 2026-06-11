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
    "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-100 font-semibold",

  secondary:
    "bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 text-cyan-600 hover:shadow-md hover:from-cyan-100 hover:to-blue-100",

  danger:
    "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md",

  outline:
    "border-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-600 hover:shadow-md hover:border-purple-400",
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
