import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useMe } from "../../hooks/useAuth";

type Mode = "login" | "register";

export const AuthContainer = () => {
  const [mode, setMode] = useState<Mode>("login");
  const { data: user, isLoading } = useMe();

  // Already logged in — skip the auth page entirely
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">MyApp</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          {/* Tab toggle — your exact design */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                mode === "login"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                mode === "register"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};
