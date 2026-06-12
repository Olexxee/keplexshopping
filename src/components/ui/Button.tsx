import { cn } from "../../lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-amber text-white hover:bg-amber-light hover:shadow-glow hover:scale-[1.02] active:scale-100 shadow-amber",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        outline: "border-2 border-amber text-amber bg-transparent hover:bg-amber/10 hover:shadow-md",
        ghost: "text-foreground hover:bg-muted hover:text-amber",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-md",
      },
      size: {
        sm: "px-4 py-2 rounded-lg text-sm",
        md: "px-5 py-2.5 rounded-lg text-base",
        lg: "px-7 py-3 rounded-xl text-lg",
        icon: "p-2 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

export const Button = ({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
    >
      {children}
    </button>
  );
};