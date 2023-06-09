/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        port: '',
        pathname: '/f/**',
      },
      {
        protocol: 'https',
        hostname: 'https://portfolio.6819b2a30e8a314c7c79a9d5de0fc1c8.r2.cloudflarestorage.com',
        port: '',
        pathname: '/',
      },
    ],
  },
}

module.exports = nextConfig
