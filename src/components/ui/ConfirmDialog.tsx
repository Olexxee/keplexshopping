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
    <p className="text-sm text-gray-500">{message}</p>
    <div className="flex gap-3 mt-6">
      <button
        onClick={onClose}
        className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isPending}
        className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white disabled:opacity-50 transition ${
          variant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {isPending ? "Please wait..." : confirmLabel}
      </button>
    </div>
  </Modal>
);
