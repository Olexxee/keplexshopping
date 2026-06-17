import { AlertTriangle, Package, ChevronRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Link } from "react-router-dom";

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  minStock?: number;
  price?: number;
}

interface LowStockItemsProps {
  items: LowStockItem[];
}

export const LowStockItems = ({ items }: LowStockItemsProps) => {
  if (!items || items.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-display-sm text-foreground">Low Stock</h2>
          <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full">
            All good
          </span>
        </div>
        <div className="flex flex-col items-center py-8">
          <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
            <Package size={24} className="text-green-500" />
          </div>
          <p className="text-sm text-muted-foreground">All items well stocked</p>
        </div>
      </Card>
    );
  }

  const criticalItems = items.filter(item => item.stock <= (item.minStock || 5));
  const warningItems = items.filter(item => item.stock > (item.minStock || 5));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-destructive" />
          <h2 className="font-display text-display-sm text-foreground">Low Stock</h2>
        </div>
        <div className="flex items-center gap-2">
          {criticalItems.length > 0 && (
            <span className="text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full">
              {criticalItems.length} critical
            </span>
          )}
          <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full">
            {items.length} total
          </span>
        </div>
      </div>

      {/* Critical Items */}
      {criticalItems.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
            Critical
          </p>
          <div className="space-y-2">
            {criticalItems.map((item) => (
              <Link
                key={item.id}
                to={`/admin/items/${item.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-destructive transition-colors">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-destructive">
                    {item.stock} left
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-destructive group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Warning Items */}
      {warningItems.length > 0 && (
        <div>
          {criticalItems.length > 0 && (
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">
              Warning
            </p>
          )}
          <div className="space-y-2">
            {warningItems.map((item) => (
              <Link
                key={item.id}
                to={`/admin/items/${item.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-orange-500 transition-colors">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-orange-500">
                    {item.stock} left
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};