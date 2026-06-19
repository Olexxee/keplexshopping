import { Outlet, useLocation } from "react-router-dom";
import { StoreHeader } from "../navigation/StoreHeader";

export const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen relative bg-background">
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber/20 blur-[120px] rounded-full animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber/10 blur-[120px] rounded-full animate-float-delayed pointer-events-none" />
      
      {/* Only show header if not on home page */}
      {!isHomePage && <StoreHeader />}

      <main className={!isHomePage ? "container mx-auto px-4 md:px-6 max-w-7xl" : ""}>
        <Outlet />
      </main>
    </div>
  );
};