import { useEffect, useState } from "react";
import {
  useCreateTraining,
  useUpdateTraining,
  useUploadTrainingMedia,
} from "../../hooks/useTrainingPrograms";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { 
  X, 
  Save, 
  Image, 
  FileText, 
  DollarSign, 
  Hash, 
  CheckCircle, 
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  training?: any;
}

export const TrainingFormModal = ({ open, onClose, training }: Props) => {
  const isEdit = !!training;

  const createMutation = useCreateTraining();
  const updateMutation = useUpdateTraining();
  const uploadMedia = useUploadTrainingMedia();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!training) {
      setForm({
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
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    setForm({
      title: training.title || "",
      slug: training.slug || "",
      shortDescription: training.shortDescription || "",
      description: training.description || "",
      price: Number(training.price || 0),
      active: training.active !== undefined ? training.active : true,
      featured: training.featured || false,
      displayOrder: training.displayOrder || 0,
      highlights: (training.highlights || []).join("\n"),
    });

    if (training.image) {
      setImagePreview(training.image);
    }
  }, [training]);

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
    setFormError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!form.title.trim()) {
        setFormError("Title is required");
        setIsSubmitting(false);
        return;
      }
      if (!form.slug.trim()) {
        setFormError("Slug is required");
        setIsSubmitting(false);
        return;
      }
      if (!form.shortDescription.trim()) {
        setFormError("Short description is required");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...form,
        highlights: form.highlights
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
        price: Number(form.price) || 0,
      };

      let programId = training?.id;

      // 1. Create or update
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: programId,
          data: payload,
        });
      } else {
        const res = await createMutation.mutateAsync(payload);
        programId = res.data.data.id;
      }

      // 2. Upload image if exists
      if (imageFile && programId) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await uploadMedia.mutateAsync({
          id: programId,
          data: formData,
        });
      }

      onClose();
    } catch (error: any) {
      setFormError(error?.message || "Failed to save training program");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || uploadMedia.isPending || isSubmitting;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-subtle">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center">
              <FileText size={20} className="text-amber" />
            </div>
            <div>
              <h2 className="font-display text-display-sm text-foreground">
                {isEdit ? "Edit Training Program" : "Create Training Program"}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEdit ? "Update program details" : "Add a new training program"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-5">
          {/* Error */}
          {formError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <AlertCircle size={16} />
              {formError}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText size={14} className="text-amber" />
              Title <span className="text-destructive">*</span>
            </label>
            <input
              placeholder="Enter program title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  title: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Hash size={14} className="text-amber" />
              Slug <span className="text-destructive">*</span>
            </label>
            <input
              placeholder="program-slug"
              value={form.slug}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier (auto-converts spaces to hyphens)
            </p>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText size={14} className="text-amber" />
              Short Description <span className="text-destructive">*</span>
            </label>
            <textarea
              placeholder="Brief description of the program"
              value={form.shortDescription}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  shortDescription: e.target.value,
                }))
              }
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 resize-y"
              required
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText size={14} className="text-amber" />
              Full Description
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the program"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 resize-y"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign size={14} className="text-amber" />
              Price (₦)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  price: Number(e.target.value) || 0,
                }))
              }
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Image size={14} className="text-amber" />
              Program Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="h-20 w-20 rounded-lg overflow-hidden border border-border shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber file:text-white hover:file:bg-amber-light file:cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200x800px, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Star size={14} className="text-amber" />
              Highlights
            </label>
            <textarea
              rows={4}
              placeholder="Enter each highlight on a new line"
              value={form.highlights}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  highlights: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              One highlight per line. These will be displayed as bullet points.
            </p>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Hash size={14} className="text-amber" />
              Display Order
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.displayOrder}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  displayOrder: Number(e.target.value) || 0,
                }))
              }
              min="0"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first
            </p>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20 border border-border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={() =>
                  setForm((p) => ({
                    ...p,
                    active: !p.active,
                  }))
                }
                className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0"
              />
              <div>
                <span className="text-sm font-medium text-foreground">Active</span>
                <p className="text-xs text-muted-foreground">Program is visible</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={() =>
                  setForm((p) => ({
                    ...p,
                    featured: !p.featured,
                  }))
                }
                className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0"
              />
              <div>
                <span className="text-sm font-medium text-foreground">Featured</span>
                <p className="text-xs text-muted-foreground">Highlighted program</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Save Changes" : "Create Program"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};