import type { PropsWithChildren } from "react";
import { useMe } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-radial from-amber/5 via-background to-background">
        <div className="relative">
          {/* Animated spinner ring */}
          <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber animate-spin" />
          </div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-amber flex items-center justify-center animate-pulse">
              <span className="text-white font-display font-bold text-sm">K</span>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="font-display text-display-sm text-foreground">
            Loading your account
          </h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we set things up...
          </p>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber"
              style={{
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};