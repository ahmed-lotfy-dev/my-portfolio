/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: [
    'text-primary/90',
    'text-primary/80',
    'border-primary/20', // Also add this, as it uses an opacity variant
    'bg-background/50', // Also add this, as it uses an opacity variant
    'bg-secondary/30', // Also add this, as it uses an opacity variant
    'bg-secondary/60', // Also add this, as it uses an opacity variant
  ],
  plugins: [require("tailwindcss-animate")],
}
