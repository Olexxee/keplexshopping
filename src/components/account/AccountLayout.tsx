import type { ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  return <div className="max-w-4xl mx-auto space-y-6">{children}</div>;
};
