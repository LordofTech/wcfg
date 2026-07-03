/**
 * WCFG Luxury Automobile Brokers — Design Tokens
 * Palette extracted from brand flyers (gold-on-pitch-black luxury aesthetic).
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#0B0B0B",
        charcoal: {
          DEFAULT: "#141414",
          velvet: "#1A1A1A",
          soft: "#222222",
          elevated: "#2A2A2A",
        },
        gold: {
          highlight: "#F5D76E",
          light: "#D4AF37",
          DEFAULT: "#C9A227",
          dark: "#AA7C11",
          deep: "#8B6914",
        },
        ivory: "#F5F5F0",
        mist: "#A8A8A0",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontWeight: {
        thin: "200",
        extralight: "200",
        light: "300",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)",
        "gold-gradient-horizontal":
          "linear-gradient(90deg, #D4AF37 0%, #F5D76E 50%, #AA7C11 100%)",
        "gold-shimmer":
          "linear-gradient(135deg, #AA7C11 0%, #D4AF37 40%, #F5D76E 50%, #D4AF37 60%, #AA7C11 100%)",
        "gold-radial":
          "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 0 40px rgba(212, 175, 55, 0.35)",
        "gold-sm": "0 0 10px rgba(212, 175, 55, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.45)",
        "glass-inset": "inset 0 1px 0 rgba(212, 175, 55, 0.12)",
      },
      borderColor: {
        "gold-muted": "rgba(212, 175, 55, 0.35)",
        "gold-subtle": "rgba(212, 175, 55, 0.18)",
      },
      backdropBlur: {
        glass: "12px",
        "glass-lg": "20px",
      },
      letterSpacing: {
        luxury: "0.2em",
        "luxury-wide": "0.35em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
