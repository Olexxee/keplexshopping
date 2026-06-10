import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isPending?: boolean;
  variant?: "danger" | "default";
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  isPending,
  variant = "default",
}: ConfirmDialogProps) => (
  <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
    <p className="text-sm text-purple-700 font-medium">{message}</p>
    <div className="flex gap-3 mt-6">
      <button
        onClick={onClose}
        className="flex-1 border-2 border-purple-300 rounded-xl py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isPending}
        className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50 transition ${
          variant === "danger"
            ? "bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
        }`}
      >
        {isPending ? "Please wait..." : confirmLabel}
      </button>
    </div>
  </Modal>
);
