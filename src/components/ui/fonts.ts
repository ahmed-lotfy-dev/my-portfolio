import { Inter, Josefin_Sans, Josefin_Slab } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--main-font",
});

export const josefinSlab = Josefin_Slab({
  subsets: ["latin"],
  variable: "--heading-font",
});
