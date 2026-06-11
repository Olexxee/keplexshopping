import { LogOut } from "lucide-react";

interface DangerZoneProps {
  onLogout: () => void;
  loading?: boolean;
}

export const DangerZone = ({ onLogout, loading }: DangerZoneProps) => {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
      <p className="text-xs text-red-500 mb-4">
        Signing out will end your current session.
      </p>
      <button
        onClick={onLogout}
        disabled={loading}
        className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 transition"
      >
        <LogOut size={16} />

        <span className="text-sm font-medium">
          {loading ? "Signing out..." : "Sign Out"}
        </span>
      </button>
    </div>
  );
};
