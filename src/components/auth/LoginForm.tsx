import { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/error";
import { Button } from "../../components/ui/Button";

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login(
      { ...form, rememberMe },
      { onError: (err) => setError(getErrorMessage(err)) }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 flex items-start gap-2">
          <span className="text-destructive">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
        />
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-xs text-amber hover:text-amber-light transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
        />
      </div>

      {/* Remember me checkbox */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="rememberMe"
          checked={rememberMe}
          onChange={handleChange}
          className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0"
        />
        <span className="text-sm text-muted-foreground">Remember me</span>
      </label>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isPending}
        fullWidth
        size="lg"
        className="mt-2"
      >
        {isPending ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-amber hover:text-amber-light font-medium transition-colors"
        >
          Create account
        </a>
      </p>
    </form>
  );
};