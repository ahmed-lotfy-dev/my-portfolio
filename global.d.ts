import { string } from "zod"

declare module "nodemailer-sendgrid"
declare module "@sendgrid/mail"
declare module "fs"
declare module "next-auth/client"
declare module "@chakra-ui/next-js"
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string
      NODE_ENV: "development" | "production"
      PORT?: string
      PWD: string
      MAIN_EMAIL: string
      SECONDARY_EMAIL: string
      DATABASE_URL
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
      SECRET: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      ID_GITHUB: string
      SECRET_GITHUB: string
      SENDGRID_API_KEY: string
      UPLOADTHING_SECRET: string
      UPLOADTHING_APP_ID: string
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
      CLERK_SECRET_KEY: string
      ADMIN_EMAIL: string
      CF_ACCOUNT_ID: string
      CF_ACCESS_KEY_ID: string
      CF_SECRET_ACCESS_KEY: string
      CF_IMAGES_SUBDOMAIN: string
    }
  }
}

declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
