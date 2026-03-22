import { Inter, Poppins, Sora, Tajawal, Playfair_Display } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// Main body font - preloaded for better LCP
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

// Heading font
export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  preload: false,
});

// Arabic font with all required weights
export const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});
