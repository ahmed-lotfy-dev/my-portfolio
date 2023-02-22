/** @type {import('next').NextConfig} */
const nextConfig = {
  // publicRuntimeConfig: {
  //   mongoUrl: process.env.MONGO_URI,
  //   bcryptSalt: process.env.BCRYPT_SALT,
  //   sendGrid: process.env.SENDGRID_API_KEY,
  // },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     use: ['@svgr/webpack'],
  //   })

  //   return config
  // },
  api: {
    bodyParser: false,
  },

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
