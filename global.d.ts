import { string } from "zod";

declare module "nodemailer-sendinblue-transport";
declare module "nodemailer-sendgrid";
declare module "@sendgrid/mail";
declare module "fs";
declare module 'next-auth/client';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
      MONGO_URI: string;
      BCRYPT_SALT: string;
      SENDGRID_API_KEY: string;
      MAIN_EMAIL: string;
      SECONDARY_EMAIL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      CF_ACCOUNT_ID: string;
      CF_ACCESSKEY_ID: string;
      CF_SECRET_ACCESS_KEY: string;
    }
  }
}

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
