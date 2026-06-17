import { useState } from "react";
import { useUpdateBusinessConfig } from "../../hooks/useBusinessConfigMutations";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  MessageCircle, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X,
  AlertCircle
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faq?: {
    items?: FAQItem[];
  };
}

export const FAQSettingsCard = ({ faq }: Props) => {
  const [items, setItems] = useState<FAQItem[]>(faq?.items || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<FAQItem>({ question: "", answer: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isPending } = useUpdateBusinessConfig();

  const save = () => {
    mutate(
      {
        key: "faq",
        value: { items },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      }
    );
  };

  const addItem = () => {
    if (!newItem.question.trim() || !newItem.answer.trim()) {
      setError("Both question and answer are required");
      return;
    }
    setError("");
    setItems([...items, newItem]);
    setNewItem({ question: "", answer: "" });
    setShowAddForm(false);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setNewItem(items[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    if (!newItem.question.trim() || !newItem.answer.trim()) {
      setError("Both question and answer are required");
      return;
    }
    setError("");
    const updated = [...items];
    updated[editingIndex] = newItem;
    setItems(updated);
    setEditingIndex(null);
    setNewItem({ question: "", answer: "" });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewItem({ question: "", answer: "" });
    setError("");
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center">
            <HelpCircle size={20} className="text-amber" />
          </div>
          <div>
            <h2 className="font-display text-display-sm text-foreground">
              Training FAQ
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Questions displayed on the training website
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

      {/* FAQ Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground">
          {items.length} {items.length === 1 ? "question" : "questions"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingIndex(null);
            setNewItem({ question: "", answer: "" });
            setError("");
          }}
          className="gap-1 text-amber hover:text-amber-light"
        >
          <Plus size={16} />
          Add Question
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-4 p-4 rounded-lg border border-amber/20 bg-amber/5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">New FAQ Item</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={newItem.question}
              onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
              placeholder="Enter question..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
            />
            <textarea
              value={newItem.answer}
              onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
              placeholder="Enter answer..."
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 resize-y"
            />
            <div className="flex gap-2">
              <Button onClick={addItem} size="sm">
                <Plus size={14} className="mr-1" />
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Items */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
            <MessageCircle size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No FAQ items yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your first frequently asked question
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="mt-4"
          >
            <Plus size={14} className="mr-1" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-amber/20"
              >
                {/* Question Header */}
                <div
                  className="flex items-start justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                        #{index + 1}
                      </span>
                      <p className="font-medium text-foreground text-sm">
                        {item.question}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(index);
                        setShowAddForm(false);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-amber hover:bg-amber/10 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(index);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-amber transition-colors">
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Answer (expanded) */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border animate-fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}

                {/* Edit Form */}
                {isEditing && (
                  <div className="px-4 pb-4 pt-2 border-t border-amber/20 bg-amber/5">
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newItem.question}
                        onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                        placeholder="Edit question..."
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
                      />
                      <textarea
                        value={newItem.answer}
                        onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
                        placeholder="Edit answer..."
                        rows={3}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 resize-y"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm">
                          <CheckCircle size={14} className="mr-1" />
                          Save Changes
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Stats */}
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total: {items.length} FAQ items</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
};