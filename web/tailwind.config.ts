import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ec',
          100: '#fdecd3',
          200: '#f9d5a5',
          300: '#f5b76d',
          400: '#f09133',
          500: '#ec7611',
          600: '#dd5c07',
          700: '#b74309',
          800: '#92350f',
          900: '#762e10',
        },
      },
    },
  },
  plugins: [],
};
export default config;
