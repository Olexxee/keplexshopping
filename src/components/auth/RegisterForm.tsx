import { useState } from "react";
import { useRegister } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/error";
import { Button } from "../../components/ui/Button";

export const RegisterForm = () => {
  const { mutate: register, isPending } = useRegister();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    register(form, {
      onError: (err) => setError(getErrorMessage(err)),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Full name field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Full name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="John Doe"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
        />
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Email address <span className="text-destructive">*</span>
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

      {/* Phone field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Phone number <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200"
        />
      </div>

      {/* Password field with show/hide */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Password <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-200 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber transition-colors"
          >
            {showPassword ? (
              <span className="text-xs">Hide</span>
            ) : (
              <span className="text-xs">Show</span>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters long
        </p>
      </div>

      {/* Password strength indicator (optional) */}
      {form.password && (
        <div className="space-y-1">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                form.password.length >= 8
                  ? "w-full bg-green-500"
                  : form.password.length >= 6
                  ? "w-3/4 bg-amber"
                  : form.password.length >= 4
                  ? "w-1/2 bg-orange-500"
                  : "w-1/4 bg-destructive"
              }`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {form.password.length >= 8
              ? "✓ Strong password"
              : form.password.length >= 6
              ? "Medium password"
              : "Weak password"}
          </p>
        </div>
      )}

      {/* Terms agreement */}
      <div className="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="h-4 w-4 rounded border-input text-amber focus:ring-amber focus:ring-offset-0 mt-0.5"
        />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the{" "}
          <a href="/terms" className="text-amber hover:text-amber-light transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-amber hover:text-amber-light transition-colors">
            Privacy Policy
          </a>
        </label>
      </div>

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
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      {/* Sign in link */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-amber hover:text-amber-light font-medium transition-colors"
        >
          Sign in
        </a>
      </p>
    </form>
  );
};