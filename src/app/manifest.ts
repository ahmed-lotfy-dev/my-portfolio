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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
