import { Inter, DM_Sans, Outfit } from "next/font/google"

export const inter = Inter({ subsets: ["latin"] })

export const plusJakarta = DM_Sans({
  subsets: ["latin"],
  variable: "--main-font",
})

export const sora = Outfit({
  subsets: ["latin"],
  variable: "--heading-font",
  weight: ["500", "600", "700", "800"],
})
