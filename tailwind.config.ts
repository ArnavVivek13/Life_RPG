import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: "#0B0E14",
          surface: "#121722",
          surfaceHover: "#1A2234",
          border: "#2A364F",
          gold: "#F59E0B",
          goldLight: "#FDE68A",
          goldDark: "#B45309",
          xp: "#9333EA",
          xpLight: "#C084FC",
          health: "#EF4444",
          mana: "#3B82F6",
          stamina: "#10B981",
        },
        attr: {
          intellect: "#3B82F6",
          strength: "#EF4444",
          discipline: "#10B981",
          creativity: "#8B5CF6",
          social: "#F59E0B",
        }
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        title: ["var(--font-title)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        pixel: "0 0 0 2px #0B0E14, 0 0 0 4px #2A364F",
        glowGold: "0 0 20px rgba(245, 158, 11, 0.35)",
        glowXp: "0 0 20px rgba(147, 51, 234, 0.35)",
      }
    },
  },
  plugins: [],
};
export default config;
