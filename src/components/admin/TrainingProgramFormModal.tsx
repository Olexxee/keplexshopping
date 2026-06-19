import { useEffect, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import {
  useCreateTraining,
  useUpdateTraining,
  useUploadTrainingMedia,
} from "../../hooks/useTrainingPrograms";
import { compressImage } from "../../utils/compressImage";

interface Props {
  open: boolean;
  onClose: () => void;
  training?: any;
}

const defaultForm = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: 0,
  active: true,
  featured: false,
  displayOrder: 0,
  highlights: "",
};

export const TrainingFormModal = ({ open, onClose, training }: Props) => {
  const isEdit = !!training;

  const createMutation = useCreateTraining();
  const updateMutation = useUpdateTraining();
  const uploadMedia = useUploadTrainingMedia();

  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMedia.isPending ||
    compressing;

  useEffect(() => {
    if (!open) return;

    if (!training) {
      setForm(defaultForm);
      setImageFile(null);
      setImagePreview(null);
      setError(null);
      return;
    }

    setForm({
      title: training.title || "",
      slug: training.slug || "",
      shortDescription: training.shortDescription || "",
      description: training.description || "",
      price: Number(training.price || 0),
      active: training.active ?? true,
      featured: training.featured ?? false,
      displayOrder: training.displayOrder || 0,
      highlights: (training.highlights || []).join("\n"),
    });

    // Show existing image as preview
    const existingImage = training.media?.find((m: any) => m.isPrimary)?.url
      || training.media?.[0]?.url
      || null;
    setImagePreview(existingImage);
    setImageFile(null);
    setError(null);
  }, [training, open]);

  const handleFile = async (file: File) => {
    // Show preview immediately
    setImagePreview(URL.createObjectURL(file));

    try {
      setCompressing(true);
      const compressed = await compressImage(file);
      setImageFile(compressed);
    } catch {
      setImageFile(file); // fallback to original
    } finally {
      setCompressing(false);
    }
  };

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...form,
      price: Number(form.price),
      highlights: form.highlights
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      let programId = training?.id;

      if (isEdit) {
        await updateMutation.mutateAsync({ id: programId, data: payload });
      } else {
        const res = await createMutation.mutateAsync(payload);
        programId = res?.data?.data?.id || res?.data?.id;
      }

      if (imageFile && programId) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await uploadMedia.mutateAsync({ id: programId, data: formData });
      }

      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || uploadMedia.isPending || isSubmitting;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-neutral-900">
            {isEdit ? "Edit Program" : "New Training Program"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Error banner */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Cover image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Cover Image
            </label>

            <label className={[
              "relative flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden",
              imagePreview ? "border-transparent" : "border-neutral-200 hover:border-pink-300 bg-neutral-50",
            ].join(" ")}>
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  {compressing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-pink-400" />
                      <span className="text-xs">Compressing...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-xs">Click to upload image</span>
                      <span className="text-xs text-neutral-300">JPEG, PNG, WEBP · Max 10MB</span>
                    </>
                  )}
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">Title</label>
            <input
              required
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Resin Art Masterclass"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">Slug</label>
            <input
              required
              value={form.slug}
              onChange={set("slug")}
              placeholder="e.g. resin-art-masterclass"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors font-mono"
            />
          </div>

          {/* Short description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">Short Description</label>
            <textarea
              rows={2}
              value={form.shortDescription}
              onChange={set("shortDescription")}
              placeholder="One-line summary shown on cards"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors resize-none"
            />
          </div>

          {/* Full description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">Full Description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={set("description")}
              placeholder="Detailed program description"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors resize-none"
            />
          </div>

          {/* Price + Display order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700">Price (₦)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700">Display Order</label>
              <input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Highlights <span className="text-neutral-400 font-normal">(one per line)</span>
            </label>
            <textarea
              rows={4}
              value={form.highlights}
              onChange={set("highlights")}
              placeholder={"Learn resin basics\nCreate keychains\nLaunch your brand"}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 transition-colors resize-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-1">
            {[
              { label: "Active", field: "active" },
              { label: "Featured", field: "featured" },
            ].map(({ label, field }) => (
              <label key={field} className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setForm((p) => ({ ...p, [field]: !p[field as keyof typeof p] }))}
                  className={[
                    "w-9 h-5 rounded-full transition-colors relative",
                    form[field as keyof typeof form] ? "bg-pink-500" : "bg-neutral-200",
                  ].join(" ")}
                >
                  <div className={[
                    "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    form[field as keyof typeof form] ? "translate-x-4" : "translate-x-0.5",
                  ].join(" ")} />
                </div>
                <span className="text-sm text-neutral-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium hover:bg-neutral-50 disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Program"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};