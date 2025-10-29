import { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ahmedlotfy.site",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "images.ahmedlotfy.dev",
        port: "",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
