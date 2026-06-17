import { Modal } from "./Modal";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isPending?: boolean;
  variant?: "danger" | "default" | "warning";
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  isPending = false,
  variant = "default",
}: ConfirmDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-destructive",
          iconBg: "bg-destructive/10",
          button: "bg-destructive text-white hover:bg-destructive/90 shadow-destructive/20",
          border: "border-destructive/20",
        };
      case "warning":
        return {
          icon: "text-orange-500",
          iconBg: "bg-orange-500/10",
          button: "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20",
          border: "border-orange-500/20",
        };
      default:
        return {
          icon: "text-amber",
          iconBg: "bg-amber/10",
          button: "bg-amber text-white hover:bg-amber-light shadow-amber/20",
          border: "border-amber/20",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <div className="space-y-6">
        {/* Icon */}
        <div className={`mx-auto w-fit rounded-full ${styles.iconBg} p-3`}>
          <AlertTriangle size={24} className={styles.icon} />
        </div>

        {/* Message */}
        <p className="text-sm text-center text-muted-foreground leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            fullWidth
            disabled={isPending}
            className="sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isPending}
            fullWidth
            className={`sm:flex-1 ${styles.button}`}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};