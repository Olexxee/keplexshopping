import type { ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  return (
    <div className="container mx-auto px-4 md:px-6 max-w-5xl">
      {children}
    </div>
  );
};