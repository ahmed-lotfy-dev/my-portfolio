/** @type {import('next').NextConfig} */
const nextConfig = {
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
    api: {
      bodyParser: {
        sizeLimit: "20mb",
      },
    },
  },
}

module.exports = nextConfig
