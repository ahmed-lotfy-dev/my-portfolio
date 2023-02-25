/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    output: 'standalone',
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        // You can add these as well
        // port: '',
        pathname: '/a/**',
      },

    ],
  },
  output: 'standalone',
}


module.exports = nextConfig
