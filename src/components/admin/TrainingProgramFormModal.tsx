import { useEffect, useState } from "react";
import {
  useCreateTraining,
  useUpdateTraining,
  useUploadTrainingMedia,
} from "../../hooks/useTrainingPrograms";

interface Props {
  open: boolean;
  onClose: () => void;
  training?: any;
}

export const TrainingFormModal = ({ open, onClose, training }: Props) => {
  const isEdit = !!training;

  const createMutation = useCreateTraining();
  const updateMutation = useUpdateTraining();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 0,
    active: true,
    featured: false,
    displayOrder: 0,
    highlights: "",
  });

  useEffect(() => {
    if (!training) return;

    setForm({
      title: training.title || "",
      slug: training.slug || "",
      shortDescription: training.shortDescription || "",
      description: training.description || "",
      price: Number(training.price || 0),
      active: training.active,
      featured: training.featured,
      displayOrder: training.displayOrder || 0,
      highlights: (training.highlights || []).join("\n"),
    });
  }, [training]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      highlights: form.highlights
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    if (isEdit) {
      await updateMutation.mutateAsync({
        id: training.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    let programId = training?.id;

    // 1. create or update
    if (isEdit) {
      await updateMutation.mutateAsync({
        id: programId,
        data: payload,
      });
    } else {
      const res = await createMutation.mutateAsync(payload);
      programId = res.data.data.id;
    }

    // 2. upload image if exists
    if (imageFile && programId) {
      const formData = new FormData();
      formData.append("file", imageFile);
      
      const uploadMedia = useUploadTrainingMedia();
      
       await uploadMedia.mutateAsync({
         id: programId,
         data: formData,
       });

    }

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          {isEdit ? "Edit Program" : "Create Program"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                title: e.target.value,
              }))
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                slug: e.target.value,
              }))
            }
            className="w-full border rounded-xl p-3"
          />

          <textarea
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                shortDescription: e.target.value,
              }))
            }
            className="w-full border rounded-xl p-3"
          />

          <textarea
            rows={6}
            placeholder="Full Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                description: e.target.value,
              }))
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                price: Number(e.target.value),
              }))
            }
            className="w-full border rounded-xl p-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImageFile(file);
            }}
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            rows={5}
            placeholder="Highlights (one per line)"
            value={form.highlights}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                highlights: e.target.value,
              }))
            }
            className="w-full border rounded-xl p-3"
          />

          <div className="flex gap-6">
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={() =>
                  setForm((p) => ({
                    ...p,
                    active: !p.active,
                  }))
                }
              />

              <span className="ml-2">Active</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={() =>
                  setForm((p) => ({
                    ...p,
                    featured: !p.featured,
                  }))
                }
              />

              <span className="ml-2">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-black text-white px-5 py-2 rounded-xl"
            >
              Save Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
