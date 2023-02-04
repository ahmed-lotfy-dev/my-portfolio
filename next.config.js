/** @type {import('next').NextConfig} */
const nextConfig = {
  // publicRuntimeConfig: {
  //   mongoUrl: process.env.MONGO_URI,
  //   bcryptSalt: process.env.BCRYPT_SALT,
  //   sendGrid: process.env.SENDGRID_API_KEY,
  // },
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
