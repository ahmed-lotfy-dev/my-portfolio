import myImage from "@/public/images/optimized/About-Image.webp";
import { getLocale } from "next-intl/server";
import AboutClient from "./AboutClient";

export default async function About() {
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return <AboutClient myImage={myImage} isRTL={isRTL} />;
}