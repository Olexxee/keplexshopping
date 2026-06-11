export const theme = {
  colors: {
  primary: "#EC4899",
  primaryLight: "#F9A8D4",

  accent: "#FBBF24",

  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",

  background: "#FFF8FB",
  surface: "#FFFFFF",

  text: "#1F2937",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",

  border: "#F3D4DF",
  borderLight: "#FCE7F3",
},

  spacing: {
    xs: "0.75rem", // 12px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
  },

  radius: {
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    lg: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    xl: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },

  animation: {
    transition: "all 0.2s ease",
    transitionSlow: "all 0.3s ease",
  },
};

// CSS variables for global styles
export const globalStyles = `
  :root {
    --primary: ${theme.colors.primary};
    --primary-light: ${theme.colors.primaryLight};
    --accent: ${theme.colors.accent};
    --success: ${theme.colors.success};
    --warning: ${theme.colors.warning};
    --danger: ${theme.colors.danger};
    --background: ${theme.colors.background};
    --surface: ${theme.colors.surface};
    --text: ${theme.colors.text};
    --text-muted: ${theme.colors.textMuted};
    --border: ${theme.colors.border};
    --radius-sm: ${theme.radius.sm};
    --radius-md: ${theme.radius.md};
    --radius-lg: ${theme.radius.lg};
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
  }
`;