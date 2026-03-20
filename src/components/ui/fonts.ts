import localFont from "next/font/local";

// Main body font - preloaded automatically by Next.js if used in layout
export const inter = localFont({
  src: "../../app/fonts/inter/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
});

// Heading font
export const poppins = localFont({
  src: [
    {
      path: "../../app/fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../app/fonts/poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../app/fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../app/fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const sora = localFont({
  src: "../../app/fonts/sora/Sora-Variable.ttf",
  variable: "--font-sora",
  display: "swap",
});

export const tajawal = localFont({
  src: [
    {
      path: "../../app/fonts/tajawal/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../app/fonts/tajawal/Tajawal-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../app/fonts/tajawal/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
  display: "swap",
});
