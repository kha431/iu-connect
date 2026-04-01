import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f4c8a", // الأزرق الداكن
        secondary: "#c8960c", // الذهبي
        background: "#f0f4f9", // لون الخلفية الفاتح
      },
    },
  },
  plugins: [],
};
export default config;