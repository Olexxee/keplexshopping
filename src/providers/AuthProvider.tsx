import type { PropsWithChildren } from "react";
import { useMe } from "../hooks/useAuth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading session...
      </div>
    );
  }

  return children;
};
