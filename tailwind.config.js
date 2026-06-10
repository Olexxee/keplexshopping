module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf5f9",
          100: "#f3e8f0",
          200: "#e8d5e6",
          300: "#d9b8d6",
          400: "#d0a0cb",
          500: "#c480ba",
          600: "#b8509e",
          700: "#9d3d80",
          800: "#7d2f66",
          900: "#5c2349",
        },
        primary: "#0f172a",
        secondary: "#1e293b",
        accent: "#c480ba",
        success: "#059669",
        warning: "#d97706",
        danger: "#dc2626",
        info: "#0284c7",
        surface: "#ffffff",
        background: "#f8f9fa",
        muted: "#64748b",
        border: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["32px", "40px"],
        "4xl": ["40px", "48px"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        sm: "0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px 0 rgba(15, 23, 42, 0.06)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)",
        lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
        xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)",
        "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
        inner: "inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideIn: "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};