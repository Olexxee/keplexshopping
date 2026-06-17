import { useState } from "react";
import type { TrainingProgram } from "../../types/business-config.types";
import { useUpdateBusinessConfig } from "../../hooks/useBusinessConfigMutations";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { 
  Save, 
  BookOpen, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Edit,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";

interface Props {
  programs: TrainingProgram[];
}

export const TrainingProgramsCard = ({ programs }: Props) => {
  const [localPrograms, setLocalPrograms] = useState(programs);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    mutate(
      {
        key: "training_programs",
        value: localPrograms,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (err) => {
          setError(err?.message || "Failed to save training programs");
        },
      }
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredPrograms = localPrograms.filter((program) =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPrograms = localPrograms.length;
  const activePrograms = localPrograms.filter((p) => p.active).length;
  const totalRevenue = localPrograms.reduce((sum, p) => sum + Number(p.price || 0), 0);

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center">
            <BookOpen size={20} className="text-amber" />
          </div>
          <div>
            <h2 className="font-display text-display-sm text-foreground">
              Training Programs
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your training program pricing and status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 animate-fade-in">
              <CheckCircle size={16} />
              Saved successfully
            </span>
          )}
          <Button
            onClick={save}
            disabled={isPending}
            size="sm"
            className="gap-2"
          >
            <Save size={16} />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-foreground">{totalPrograms}</p>
          <p className="text-xs text-muted-foreground">Total Programs</p>
        </div>
        <div className="bg-green-500/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-green-600">{activePrograms}</p>
          <p className="text-xs text-muted-foreground">Active Programs</p>
        </div>
        <div className="bg-amber/5 rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-amber">₦{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
        />
      </div>

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
            <BookOpen size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No programs found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search" : "No training programs available"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-amber/20"
            >
              {/* Program Header */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${program.active ? 'bg-green-500' : 'bg-muted'}`} />
                    <h3 className="font-medium text-foreground truncate">
                      {program.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      program.active 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {program.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {program.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {program.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-amber" />
                    <input
                      type="number"
                      value={program.price}
                      onChange={(e) => updatePrice(program.id, Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-24 rounded-lg border border-input bg-background px-3 py-1.5 text-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={program.active}
                      onChange={() => toggleActive(program.id)}
                      className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0"
                    />
                    <span className="text-xs text-muted-foreground hidden sm:inline">Active</span>
                  </label>

                  <button
                    onClick={() => toggleExpand(program.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-amber hover:bg-amber/10 transition-colors"
                  >
                    {expandedId === program.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === program.id && (
                <div className="px-4 pb-4 pt-0 border-t border-border animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Slug</p>
                      <p className="text-sm font-mono text-foreground mt-0.5">{program.slug}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Display Order</p>
                      <p className="text-sm text-foreground mt-0.5">{program.displayOrder || 0}</p>
                    </div>
                    {program.highlights && program.highlights.length > 0 && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Highlights</p>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {program.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-sm text-foreground">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {program.image && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">Image</p>
                        <img
                          src={program.image}
                          alt={program.title}
                          className="mt-1 h-32 w-48 object-cover rounded-lg border border-border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Showing {filteredPrograms.length} of {totalPrograms} programs
          </span>
          <span>
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
};