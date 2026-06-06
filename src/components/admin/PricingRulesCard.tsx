import { useState } from "react";

export const PricingRulesCard = ({ rules }: any) => {
  const [form, setForm] = useState(rules);

  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate({
      key: "pricing_rules",
      value: form,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between mb-5">
        <h2 className="font-semibold text-lg">Pricing Rules</h2>

        <button
          onClick={save}
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Save
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label>Global Discount %</label>

          <input
            type="number"
            value={form.globalDiscount}
            onChange={(e) =>
              setForm({
                ...form,
                globalDiscount: Number(e.target.value),
              })
            }
            className="border rounded-xl px-3 py-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};
function useUpdateBusinessConfig(): { mutate: any; isPending: any; } {
  throw new Error("Function not implemented.");
}

