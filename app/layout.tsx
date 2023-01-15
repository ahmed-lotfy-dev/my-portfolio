import "./globals.css";
import { Josefin_Sans, Josefin_Slab } from "@next/font/google";
import Nav from "../components/nav";
const josefinsans = Josefin_Sans({
  variable: "--main-font",
});

const josefinslab = Josefin_Slab({
  variable: "--heading-font",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${josefinsans.variable} ${josefinslab.variable} h-screen`}
    >
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
