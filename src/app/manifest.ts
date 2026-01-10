import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahmed Lotfy | Full Stack Developer",
    short_name: "Ahmed Lotfy",
    description: "Portfolio of Ahmed Lotfy, a Full Stack Developer specializing in Next.js, React, and Modern Web Technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b", // zinc-950
    theme_color: "#09090b",
    icons: [
      {
        src: "/fav.ico",
        sizes: "32x32",
        type: "image/ico",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
