import { useState } from "react";

interface Props {
  settings: {
    enabled: boolean;
    showOnLandingPage: boolean;
    showInStore: boolean;
  };
}

export const ImportationSettingsCard = ({ settings }: Props) => {
  const [form, setForm] = useState(settings);

  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate({
      key: "importation_settings",
      value: form,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between mb-5">
        <h2 className="font-semibold text-lg">Importation Program</h2>

        <button
          onClick={save}
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Save
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) =>
              setForm({
                ...form,
                enabled: e.target.checked,
              })
            }
          />
          Enable Program
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.showOnLandingPage}
            onChange={(e) =>
              setForm({
                ...form,
                showOnLandingPage: e.target.checked,
              })
            }
          />
          Show On Landing Page
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.showInStore}
            onChange={(e) =>
              setForm({
                ...form,
                showInStore: e.target.checked,
              })
            }
          />
          Show In Ecommerce
        </label>
      </div>
    </div>
  );
};
function useUpdateBusinessConfig(): { mutate: any; isPending: any; } {
  throw new Error("Function not implemented.");
}

