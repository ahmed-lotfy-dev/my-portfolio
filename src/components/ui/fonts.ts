import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"

export const inter = Inter({ subsets: ["latin"] })

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--main-font",
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--heading-font",
})
