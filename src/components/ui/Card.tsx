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
        glass: "bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-border/50 shadow-lg",
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
      radius: {
        default: "rounded-xl",
        sm: "rounded-lg",
        md: "rounded-2xl",
        lg: "rounded-3xl",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
      padding: "md",
      radius: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const Card = ({
  children,
  className,
  variant,
  hoverable,
  padding,
  radius,
  asChild = false,
  ...props
}: CardProps) => {
  const Comp = asChild ? "span" : "div";
  return (
    <Comp
      className={cn(cardVariants({ variant, hoverable, padding, radius, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
};

// Card subcomponents with enhanced styling
export const CardHeader = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={cn("border-b border-border pb-4 mb-4", className)}>
    {children}
  </div>
);

export const CardTitle = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <h3 className={cn("font-display text-display-sm text-foreground tracking-tight", className)}>
    {children}
  </h3>
);

export const CardDescription = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <p className={cn("text-muted-foreground text-sm leading-relaxed", className)}>
    {children}
  </p>
);

export const CardContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

export const CardFooter = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={cn("border-t border-border pt-4 mt-4", className)}>
    {children}
  </div>
);

// Additional card components
export const CardImage = ({ 
  src, 
  alt = "", 
  className,
  height = "h-48"
}: { 
  src: string; 
  alt?: string; 
  className?: string;
  height?: string;
}) => (
  <div className={cn("overflow-hidden", height, className)}>
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
    />
  </div>
);

export const CardBadge = ({ 
  children, 
  className,
  variant = "default"
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) => {
  const variantStyles = {
    default: "bg-amber text-white",
    success: "bg-green-500 text-white",
    warning: "bg-orange-500 text-white",
    danger: "bg-destructive text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <span className={cn(
      "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium shadow-md",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const CardActions = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    {children}
  </div>
);

// Compound Card component for easier usage
export const CompoundCard = {
  Root: Card,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Image: CardImage,
  Badge: CardBadge,
  Actions: CardActions,
};

// Usage example with Compound Card:
// <CompoundCard.Root variant="elevated" hoverable>
//   <CompoundCard.Image src="/image.jpg" />
//   <CompoundCard.Badge variant="success">New</CompoundCard.Badge>
//   <CompoundCard.Header>
//     <CompoundCard.Title>Card Title</CompoundCard.Title>
//     <CompoundCard.Description>Card description</CompoundCard.Description>
//   </CompoundCard.Header>
//   <CompoundCard.Content>
//     <p>Card content goes here</p>
//   </CompoundCard.Content>
//   <CompoundCard.Footer>
//     <CompoundCard.Actions>
//       <Button size="sm">Action</Button>
//     </CompoundCard.Actions>
//   </CompoundCard.Footer>
// </CompoundCard.Root>