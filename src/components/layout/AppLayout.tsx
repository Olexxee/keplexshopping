import { Outlet } from "react-router-dom";
import { StoreHeader } from "../navigation/StoreHeader";

export const AppLayout = () => {
  return (
    <div className="
min-h-screen
relative
overflow-hidden
bg-gradient-to-br
from-pink-50
via-white
to-cyan-50
">
  <div className="
fixed
top-0
left-0
w-96
h-96
bg-pink-500/20
blur-[120px]
rounded-full
animate-float
"/>

<div className="
fixed
bottom-0
right-0
w-96
h-96
bg-cyan-500/20
blur-[120px]
rounded-full
animate-float
"/>
      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
