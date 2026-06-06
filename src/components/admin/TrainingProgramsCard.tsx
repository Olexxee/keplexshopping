import { useState } from "react";
import type { TrainingProgram } from "../../types/business-config.types";

interface Props {
  programs: TrainingProgram[];
}

export const TrainingProgramsCard = ({ programs }: Props) => {
  const [localPrograms, setLocalPrograms] = useState(programs);

  const { mutate, isPending } = useUpdateBusinessConfig();

  const updatePrice = (id: string, price: number) => {
    setLocalPrograms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              price,
            }
          : p,
      ),
    );
  };

  const toggleActive = (id: string) => {
    setLocalPrograms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              active: !p.active,
            }
          : p,
      ),
    );
  };

  const save = () => {
    mutate({
      key: "training_programs",
      value: localPrograms,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-lg">Training Programs</h2>

        <button
          onClick={save}
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Save
        </button>
      </div>

      <div className="space-y-4">
        {localPrograms.map((program) => (
          <div key={program.id} className="grid grid-cols-3 gap-4 items-center">
            <div>
              <p className="font-medium">{program.title}</p>
            </div>

            <input
              type="number"
              value={program.price}
              onChange={(e) => updatePrice(program.id, Number(e.target.value))}
              className="border rounded-xl px-3 py-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={program.active}
                onChange={() => toggleActive(program.id)}
              />
              Active
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
function useUpdateBusinessConfig(): { mutate: any; isPending: any; } {
  throw new Error("Function not implemented.");
}

