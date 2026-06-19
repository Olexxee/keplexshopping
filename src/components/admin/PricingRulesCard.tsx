import { useState } from "react";
import { useUpdateBusinessConfig } from "../../hooks/useBusinessConfigMutations";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Save, Percent, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface PricingRules {
  globalDiscount: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  bulkDiscountThreshold?: number;
  bulkDiscountRate?: number;
  [key: string]: any;
}

interface PricingRulesCardProps {
  rules: PricingRules;
}

export const PricingRulesCard = ({ rules }: PricingRulesCardProps) => {
  const [form, setForm] = useState<PricingRules>({
    globalDiscount: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    bulkDiscountThreshold: 0,
    bulkDiscountRate: 0,
    ...rules,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate(
      {
        key: "pricing_rules",
        value: form,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      }
    );
  };

  const handleChange = (field: keyof PricingRules, value: string) => {
    setForm({
      ...form,
      [field]: value === "" ? 0 : Number(value),
    });
  };

  const fields = [
    {
      key: "globalDiscount" as const,
      label: "Global Discount (%)",
      icon: Percent,
      placeholder: "0",
      helpText: "Apply a percentage discount to all products",
    },
    {
      key: "minOrderAmount" as const,
      label: "Minimum Order Amount (₦)",
      icon: DollarSign,
      placeholder: "0",
      helpText: "Minimum amount required for discount eligibility",
    },
    {
      key: "maxDiscountAmount" as const,
      label: "Maximum Discount (₦)",
      icon: DollarSign,
      placeholder: "0",
      helpText: "Maximum discount amount per order",
    },
    {
      key: "bulkDiscountThreshold" as const,
      label: "Bulk Order Threshold",
      icon: TrendingUp,
      placeholder: "0",
      helpText: "Minimum quantity for bulk discount",
    },
    {
      key: "bulkDiscountRate" as const,
      label: "Bulk Discount Rate (%)",
      icon: Percent,
      placeholder: "0",
      helpText: "Additional discount for bulk orders",
    },
  ];

  // Helper function to safely get values
  const getValue = (key: keyof PricingRules): number => {
    return form[key] ?? 0;
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-display-sm text-foreground">
            Pricing Rules
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your store's pricing and discount rules
          </p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="text-sm font-medium text-green-600 animate-fade-in">
              ✓ Saved successfully
            </span>
          )}
          <Button
            onClick={save}
            disabled={isPending}
            size="sm"
            className="gap-2"
          >
            <Save size={16} />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => {
          const Icon = field.icon;
          const value = getValue(field.key);

          return (
            <div key={field.key} className="space-y-2">
              <label
                htmlFor={field.key}
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Icon size={14} className="text-amber" />
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={field.key}
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
                />
                {value > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-amber">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber/5 border border-amber/10">
          <AlertCircle size={16} className="text-amber shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Current Configuration
            </p>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
              {getValue("globalDiscount") > 0 && (
                <span>• Global Discount: <span className="font-semibold text-amber">{getValue("globalDiscount")}%</span></span>
              )}
              {getValue("minOrderAmount") > 0 && (
                <span>• Min Order: <span className="font-semibold text-amber">₦{getValue("minOrderAmount").toLocaleString()}</span></span>
              )}
              {getValue("maxDiscountAmount") > 0 && (
                <span>• Max Discount: <span className="font-semibold text-amber">₦{getValue("maxDiscountAmount").toLocaleString()}</span></span>
              )}
              {getValue("bulkDiscountThreshold") > 0 && getValue("bulkDiscountRate") > 0 && (
                <span>• Bulk: <span className="font-semibold text-amber">{getValue("bulkDiscountThreshold")}+ items at {getValue("bulkDiscountRate")}% off</span></span>
              )}
              {getValue("globalDiscount") === 0 && 
               getValue("minOrderAmount") === 0 && 
               getValue("bulkDiscountThreshold") === 0 && (
                <span className="text-muted-foreground">No active pricing rules</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};