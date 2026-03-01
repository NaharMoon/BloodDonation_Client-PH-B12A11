/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        blood: {
          "base-100": "#ffffff",
          "base-200": "#faf7f8",
          "base-300": "#efe7ea",
          "base-content": "#1b1114",

          "primary": "#46052D",
          "primary-content": "#ffffff",

          "secondary": "#6A0B37",
          "secondary-content": "#ffffff",

          accent: "#B32346",
          "accent-content": "#ffffff",

          neutral: "#1b1114",
          "neutral-content": "#ffffff",

          // No blue tones
          info: "#6A0B37",
          success: "#7A163B",
          warning: "#B32346",
          error: "#8b0a3a",

          "--rounded-box": "1.25rem",
          "--rounded-btn": "0.9rem",
          "--rounded-badge": "0.9rem",
        },
      },
      {
        bloodDark: {
          // "base-100": "#19171b",
          // "base-200": "#151317",
          // "base-300": "#0f0e11",
          // "base-content": "#f5eef0",

          // base v2
          "base-100": "#1b0202",
          "base-200": "#220901",
          "base-300": "#38040e",
          "base-content": "#eacbd4",

          "primary": "#75020f",
          "primary-content": "#ffffff",

          "secondary": "#51080d",
          "secondary-content": "#ffffff",

          "accent": "#b50b1b",
          "accent-content": "#ffffff",

          "neutral": "#0f0e11",
          "neutral-content": "#f5eef0",

          "info": "#75020f",
          "success": "#2e7d57",
          "warning": "#e0a44e",
          "error": "#ff4d6d",

          "--rounded-box": "1.25rem",
          "--rounded-btn": "0.9rem",
          "--rounded-badge": "0.9rem",
        }
      },
    ],
  },
};
