import { useState } from "react";
import { useUpdateBusinessConfig } from "../../hooks/useBusinessConfigMutations";

export const StoreSettingsCard = ({ settings }: any) => {
  const [form, setForm] = useState(settings);

  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate({
      key: "store_settings",
      value: form,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between mb-5">
        <h2 className="font-semibold text-lg">Store Settings</h2>

        <button
          onClick={save}
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Save
        </button>
      </div>

      <label className="flex gap-3 items-center">
        <input
          type="checkbox"
          checked={form.showImportedCategory}
          onChange={(e) =>
            setForm({
              ...form,
              showImportedCategory: e.target.checked,
            })
          }
        />
        Show Importation Category
      </label>
    </div>
  );
};

