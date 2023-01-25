/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    output: 'standalone',
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
