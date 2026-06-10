import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: ModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl w-full ${width} p-6 border-2 border-purple-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{title}</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-600 text-2xl leading-none font-light"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
