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
        hostname: 'images.ahmedlotfy.me',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'https://img.clerk.com/',
        port: '',
        pathname: '/*',
      },
    ],
  },
}

module.exports = nextConfig
