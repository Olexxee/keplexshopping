import { cn } from "../../lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "relative overflow-hidden rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border-border shadow-md",
        elevated: "bg-card border-border/50 shadow-lg hover:shadow-xl",
        bordered: "bg-transparent border-2 border-amber/20",
        ghost: "bg-transparent border-transparent shadow-none",
      },
      hoverable: {
        true: "hover:-translate-y-1 hover:shadow-lg hover:border-amber/30 cursor-pointer",
        false: "",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
        xl: "p-9",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({
  children,
  className,
  variant,
  hoverable,
  padding,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(cardVariants({ variant, hoverable, padding, className }))}
      {...props}
    >
      {children}
    </div>
  );
};

// Optional: Card subcomponents
export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("border-b border-border pb-4 mb-4", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("font-display text-display-sm text-foreground", className)}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-muted-foreground text-sm", className)}>
    {children}
  </p>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("border-t border-border pt-4 mt-4", className)}>
    {children}
  </div>
);