import { useState } from "react";
import { useUpdateBusinessConfig } from "../../hooks/useBusinessConfigMutations";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Save, Store } from "lucide-react";

interface StoreSettingsCardProps {
  settings: {
    showImportedCategory: boolean;
    [key: string]: any;
  };
}

export const StoreSettingsCard = ({ settings }: StoreSettingsCardProps) => {
  const [form, setForm] = useState(settings);
  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate({
      key: "store_settings",
      value: form,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-display-sm text-foreground flex items-center gap-2">
          <Store size={20} className="text-amber" />
          Store Settings
        </h2>
        <Button onClick={save} disabled={isPending} size="sm" className="gap-2">
          <Save size={16} />
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-lg bg-amber/5 border border-amber/10 cursor-pointer hover:bg-amber/10 transition-colors">
        <input
          type="checkbox"
          checked={form.showImportedCategory}
          onChange={(e) =>
            setForm({
              ...form,
              showImportedCategory: e.target.checked,
            })
          }
          className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0 mt-0.5"
        />
        <div>
          <span className="text-sm font-medium text-foreground">
            Show Importation Category
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Display imported product categories in your store
          </p>
        </div>
      </label>
    </Card>
  );
};