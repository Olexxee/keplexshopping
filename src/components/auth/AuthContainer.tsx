import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useMe } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";

type Mode = "login" | "register";

export const AuthContainer = () => {
  const [mode, setMode] = useState<Mode>("login");
  const { data: user, isLoading } = useMe();

  // Already logged in — skip the auth page entirely
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-amber/5 via-background to-background px-4">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber/20 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none animate-float-delayed" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-amber shadow-amber mb-4 mx-auto">
            <span className="text-white font-display font-bold text-2xl">K</span>
          </div>
          <h1 className="font-display text-display-md text-foreground">
            Keplex
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "login" ? "Welcome back to your marketplace" : "Create your account to start shopping"}
          </p>
        </div>

        <Card padding="none" className="overflow-hidden">
          {/* Tab toggle */}
          <div className="flex gap-1 p-1 bg-muted/30 border-b border-border">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-amber text-white shadow-amber"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-amber text-white shadow-amber"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-amber hover:text-amber-light transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-amber hover:text-amber-light transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};