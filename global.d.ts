declare module "nodemailer-sendgrid";
declare module "@sendgrid/mail";
declare module "fs";
declare module "@chakra-ui/next-js";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string | undefined;
      PWD: string;
      MAIN_EMAIL: string;
      SECONDARY_EMAIL: string;
      DATABASE_URL: string | undefined;
      AUTH_URL: string;
      AUTH_SECRET: string;
      SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      SENDGRID_API_KEY: string;
      UPLOADTHING_SECRET: string;
      UPLOADTHING_APP_ID: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      ADMIN_EMAIL: string;
      CF_ACCOUNT_ID: string;
      CF_ACCESS_KEY_ID: string;
      CF_SECRET_ACCESS_KEY: string;
      CF_IMAGES_SUBDOMAIN: string;
      CF_BUCKET_NAME: string;
      GA_ID: string;
    }
  }
}

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

export type User = {
  name: string;
  email: string;
  image: string;
  id: string;
  role: string;
  id: number;
};

export type certificateType = {
  id: string;
  title: string;
  desc: string;
  imageLink: string;
  courseLink: string;
  profLink: string;
  createdAt: string;
  updatedAt: string;
};

export type projectsType = {
  id: string;
  title: string;
  desc: string;
  repoLink: string;
  liveLink: string;
  imageLink: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
};

export type postType = {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageLink: string;
  published: boolean;
  categories: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
};
