/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0C1116",
        "ink-soft": "#121A21",
        surface: "#16202A",
        mist: "#E8EEEA",
        muted: "#8B9A93",
        sage: "#7FD1A6",
        amber: "#F0C088",
        line: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(10px)",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
