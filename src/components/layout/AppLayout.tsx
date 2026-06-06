import { Outlet } from "react-router-dom";
import { StoreHeader } from "../navigation/StoreHeader";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
