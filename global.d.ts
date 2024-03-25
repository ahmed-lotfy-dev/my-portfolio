declare module "nodemailer-sendgrid"
declare module "@sendgrid/mail"
declare module "fs"
declare module "@chakra-ui/next-js"

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "development" | "production"
      PORT: string | undefined
      PWD: string
      MAIN_EMAIL: string
      SECONDARY_EMAIL: string
      GOOGLE_ID: string
      GOOGLE_SECRET: string
      GITHUB_ID: string
      GITHUB_SECRET: string
      SENDGRID_API_KEY: string
      BASE_URL: string
      APP_ID: string
      APP_SECRET: string
      ENDPOINT: string
      COOKIE_SECRET: string
      DATABASE_URL: string
      UPLOADTHING_SECRET: string
      ADMIN_EMAIL: string
      NEXT_PUBLIC_ADMIN_EMAIL: string
      CF_ACCOUNT_ID: string
      CF_ACCESS_KEY_ID: string
      CF_SECRET_ACCESS_KEY: string
      CF_IMAGES_SUBDOMAIN: string
      CF_BUCKET_NAME: string
      GA_ID: string
    }
  }
}

declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

export type User = {
  name: string
  email: string
  image: string
  id: string
  role: string
  id: number
}

export type certificateType = {
  id: string
  title: string
  desc: string
  imageLink: string
  courseLink: string
  profLink: string
  createdAt: string
  updatedAt: string
}

export type projectsType = {
  id: string
  title: string
  desc: string
  repoLink: string
  liveLink: string
  imageLink: string
  categories: string[]
  createdAt: string
  updatedAt: string
}

export type postType = {
  id: string
  title: string
  content: string
  slug: string
  imageLink: string
  published: boolean
  categories: string[]
  author?: string
  createdAt: string
  updatedAt: string
}
