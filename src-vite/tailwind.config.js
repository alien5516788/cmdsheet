/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        terminal: {
          bg: "var(--terminal-bg)",
          fg: "var(--terminal-fg)",
          muted: "var(--terminal-muted)",
          accent: "var(--terminal-accent)",
          border: "var(--terminal-border)",
        },
      },
    },
  },
  plugins: [],
};
