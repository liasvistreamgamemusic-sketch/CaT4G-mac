/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS Variables
        background: {
          DEFAULT: "var(--color-bg-primary)",
          elevated: "var(--color-bg-elevated)",
          surface: "var(--color-bg-surface)",
          hover: "var(--color-bg-hover)",
        },
        primary: {
          DEFAULT: "var(--color-accent-primary)",
          hover: "var(--color-accent-primary-hover)",
          light: "var(--color-accent-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-accent-secondary)",
        },
        accent: {
          blue: "var(--color-info)",
          green: "var(--color-success)",
          yellow: "var(--color-warning)",
          red: "var(--color-error)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        border: {
          DEFAULT: "var(--color-border-default)",
          light: "var(--color-border-light)",
          focus: "var(--color-border-focus)",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s infinite",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
