import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  useTrainingPrograms,
  useDeleteTraining,
  useToggleTrainingStatus,
  useToggleFeaturedTraining,
} from "../../hooks/useTrainingPrograms";
import { TrainingFormModal } from "../../components/admin/TrainingProgramFormModal";

export const TrainingProgramsPage = () => {
  const { data, isLoading } = useTrainingPrograms();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const deleteTraining = useDeleteTraining();
  const toggleStatus = useToggleTrainingStatus();
  const toggleFeatured = useToggleFeaturedTraining();

  const handleDelete = (id: string) => {
    const ok = window.confirm("Delete this training program?");
    if (!ok) return;
    deleteTraining.mutate(id);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader label="Admin" title="Training Programs" />
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          New Program
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Program
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Price
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Featured
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((program: any) => (
              <tr
                key={program.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {program.title}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  ₦{Number(program.price).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      program.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {program.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      program.featured
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {program.featured ? "Featured" : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => {
                        setSelected(program);
                        setOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        toggleStatus.mutate({
                          id: program.id,
                          active: !program.active,
                        })
                      }
                      className="px-3 py-1 rounded-lg text-xs bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                    >
                      {program.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() =>
                        toggleFeatured.mutate({
                          id: program.id,
                          featured: !program.featured,
                        })
                      }
                      className="px-3 py-1 rounded-lg text-xs bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                    >
                      {program.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!data?.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No training programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TrainingFormModal
        open={open}
        onClose={() => setOpen(false)}
        training={selected}
      />
    </div>
  );
};
