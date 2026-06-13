import { useState } from "react";
import type { TrainingProgramFormValues } from "../../types/training.types";

interface Props {
  initialValues?: TrainingProgramFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: TrainingProgramFormValues) => void;
}

const defaultValues: TrainingProgramFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: 0,
  active: true,
  featured: false,
  displayOrder: 0,
  highlights: [],
};

export const TrainingProgramForm = ({
  initialValues = defaultValues,
  isSubmitting,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState(initialValues);

  const updateField = (key: keyof TrainingProgramFormValues, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addHighlight = () => {
    updateField("highlights", [...form.highlights, ""]);
  };

  const updateHighlight = (index: number, value: string) => {
    updateField(
      "highlights",
      form.highlights.map((item: any, i: number) => (i === index ? value : item)),
    );
  };

  const removeHighlight = (index: number) => {
    updateField(
      "highlights",
      form.highlights.filter((_: any, i: number) => i !== index),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...form,
      highlights: form.highlights.filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}

      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="font-semibold mb-4">Basic Information</h2>

        <div className="space-y-4">
          <input
            value={form.title}
            placeholder="Title"
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            value={form.slug}
            placeholder="Slug"
            onChange={(e) => updateField("slug", e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            value={form.price}
            placeholder="Price"
            onChange={(e) => updateField("price", Number(e.target.value))}
            className="w-full border rounded-xl p-3"
          />
        </div>
      </div>

      {/* Descriptions */}

      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="font-semibold mb-4">Descriptions</h2>

        <div className="space-y-4">
          <textarea
            rows={3}
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            className="w-full border rounded-xl p-3"
            placeholder="Short Description"
          />

          <textarea
            rows={8}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full border rounded-xl p-3"
            placeholder="Full Description"
          />
        </div>
      </div>

      {/* Highlights */}

      <div className="bg-white rounded-2xl p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Highlights</h2>

          <button
            type="button"
            onClick={addHighlight}
            className="px-3 py-2 rounded-xl border"
          >
            Add Highlight
          </button>
        </div>

        <div className="space-y-3">
          {form.highlights.map((highlight: string, index: number) => (
            <div key={index} className="flex gap-3">
              <input
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                className="flex-1 border rounded-xl p-3"
              />

              <button type="button" onClick={() => removeHighlight(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}

      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="font-semibold mb-4">Settings</h2>

        <div className="space-y-3">
          <label className="flex gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
            />
            Active
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
            />
            Featured
          </label>

          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              updateField("displayOrder", Number(e.target.value))
            }
            className="border rounded-xl p-3"
            placeholder="Display Order"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        {isSubmitting ? "Saving..." : "Save Program"}
      </button>
    </form>
  );
};