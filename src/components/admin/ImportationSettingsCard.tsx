import { useState } from "react";
import { useUpdateBusinessConfig } from "../../hooks/useBusinessConfigMutations";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Save, Package, Globe, Store, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Props {
  settings: {
    enabled: boolean;
    showOnLandingPage: boolean;
    showInStore: boolean;
  };
}

export const ImportationSettingsCard = ({ settings }: Props) => {
  const [form, setForm] = useState({
    enabled: false,
    showOnLandingPage: false,
    showInStore: false,
    ...settings,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate(
      {
        key: "importation_settings",
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

  const handleToggle = (field: keyof typeof form) => {
    setForm({
      ...form,
      [field]: !form[field],
    });
  };

  const settingsOptions = [
    {
      key: "enabled" as const,
      label: "Enable Importation Program",
      description: "Turn on the importation program to allow users to import products",
      icon: Package,
    },
    {
      key: "showOnLandingPage" as const,
      label: "Show on Landing Page",
      description: "Display importation program on the landing page",
      icon: Globe,
    },
    {
      key: "showInStore" as const,
      label: "Show in Ecommerce Store",
      description: "Display importation program in the ecommerce store",
      icon: Store,
    },
  ];

  const isEnabled = form.enabled;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
            isEnabled ? "bg-amber/10" : "bg-muted/30"
          }`}>
            <Package size={20} className={isEnabled ? "text-amber" : "text-muted-foreground"} />
          </div>
          <div>
            <h2 className="font-display text-display-sm text-foreground">
              Importation Program
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure your importation program settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 animate-fade-in">
              <CheckCircle size={16} />
              Saved successfully
            </span>
          )}
          {isEnabled && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle size={12} />
              Active
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

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isEnabled 
          ? "bg-green-500/5 border-green-500/20" 
          : "bg-muted/20 border-border"
      }`}>
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <CheckCircle size={18} className="text-green-500" />
          ) : (
            <AlertCircle size={18} className="text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {isEnabled ? "Program is active" : "Program is disabled"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEnabled 
                ? "Your importation program is currently running" 
                : "Enable the program to allow importation features"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-4">
        {settingsOptions.map((option) => {
          const Icon = option.icon;
          const isChecked = form[option.key];
          const isDisabled = option.key !== "enabled" && !isEnabled;

          return (
            <label
              key={option.key}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                isChecked
                  ? "border-amber/30 bg-amber/5 hover:bg-amber/10"
                  : isDisabled
                  ? "border-border bg-muted/10 opacity-60 cursor-not-allowed"
                  : "border-border bg-background hover:bg-muted/20"
              }`}
              onClick={(e) => {
                // Prevent toggling if disabled
                if (isDisabled) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(option.key)}
                  disabled={isDisabled}
                  className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0 disabled:opacity-50"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={isChecked ? "text-amber" : "text-muted-foreground"} />
                  <span className={`text-sm font-medium ${
                    isChecked ? "text-foreground" : isDisabled ? "text-muted-foreground" : "text-foreground"
                  }`}>
                    {option.label}
                  </span>
                  {isChecked && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-amber">
                      <CheckCircle size={10} />
                      On
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${
                  isChecked ? "text-muted-foreground" : "text-muted-foreground/70"
                }`}>
                  {option.description}
                </p>
                {isDisabled && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    Enable the program first
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Summary Section */}
      {isEnabled && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-green-600 mt-1">Active</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground">Landing Page</p>
              <p className={`text-sm font-semibold mt-1 ${form.showOnLandingPage ? "text-amber" : "text-muted-foreground"}`}>
                {form.showOnLandingPage ? "Visible" : "Hidden"}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground">Ecommerce Store</p>
              <p className={`text-sm font-semibold mt-1 ${form.showInStore ? "text-amber" : "text-muted-foreground"}`}>
                {form.showInStore ? "Visible" : "Hidden"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};