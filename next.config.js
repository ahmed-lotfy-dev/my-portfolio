/** @type {import('next').NextConfig} */
const nextConfig = {
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
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
}

module.exports = nextConfig
