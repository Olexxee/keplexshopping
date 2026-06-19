import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";




interface AccountMenuItemProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  to?: string;
  disabled?: boolean;
  variant?: "default" | "danger" | "warning";
}

export const AccountMenuItem = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  to,
  disabled,
  variant = "default",
}: AccountMenuItemProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          text: "text-destructive group-hover:text-destructive",
          icon: "bg-destructive/10 text-destructive group-hover:bg-destructive/20",
          badge: "bg-destructive text-white",
          hover: "hover:bg-destructive/5",
        };
      case "warning":
        return {
          text: "text-orange-600 group-hover:text-orange-700",
          icon: "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20",
          badge: "bg-orange-500 text-white",
          hover: "hover:bg-orange-500/5",
        };
      default:
        return {
          text: "text-foreground group-hover:text-amber",
          icon: "bg-amber/10 text-amber group-hover:bg-amber/20",
          badge: "bg-amber text-white",
          hover: "hover:bg-muted/50",
        };
    }
  };

  const styles = getVariantStyles();

  const content = (
    <>
      {/* Icon */}
      {Icon && (
        <div className={`h-10 w-10 rounded-lg ${styles.icon} flex items-center justify-center transition-colors shrink-0`}>
          <Icon size={18} />
        </div>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium transition-colors duration-200 ${styles.text}`}>
            {title}
          </p>
          {badge && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${styles.badge} font-medium`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Arrow */}
      {!disabled && (
        <ChevronRight 
          size={18} 
          className="text-muted-foreground group-hover:text-amber group-hover:translate-x-1 transition-all duration-200 shrink-0" 
        />
      )}
    </>
  );

  if (disabled) {
    return (
      <div className={`flex items-center gap-4 px-5 py-4 opacity-60 cursor-not-allowed bg-muted/10 ${styles.hover}`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to!}
      className={`flex items-center gap-4 px-5 py-4 transition-all duration-200 group ${styles.hover}`}
    >
      {content}
    </Link>
  );
};