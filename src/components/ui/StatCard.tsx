import { Card } from "./Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon?: React.ElementType;
  variant?: "default" | "primary" | "success" | "warning" | "info";
  trend?: number;
}

export const StatCard = ({ 
  label, 
  value, 
  sub, 
  icon: Icon, 
  variant = "default",
  trend 
}: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "border-amber/20 bg-gradient-amber/5";
      case "success":
        return "border-green-500/20 bg-green-500/5";
      case "warning":
        return "border-orange-500/20 bg-orange-500/5";
      case "info":
        return "border-blue-500/20 bg-blue-500/5";
      default:
        return "border-border";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-amber/10 text-amber";
      case "success":
        return "bg-green-500/10 text-green-600";
      case "warning":
        return "bg-orange-500/10 text-orange-600";
      case "info":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp size={14} className="text-green-600" />;
    if (trend < 0) return <TrendingDown size={14} className="text-red-600" />;
    return <Minus size={14} className="text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <Card hoverable className={`p-6 border ${getVariantStyles()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
          {sub && (
            <p className="text-sm text-muted-foreground mt-1">
              {sub}
            </p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`h-10 w-10 rounded-lg ${getIconStyles()} flex items-center justify-center shrink-0`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
};