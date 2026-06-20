import experiencesData from "@/src/data/experiences.json";
import ExperienceClient from "./ExperienceClient";
import { getLocale } from "next-intl/server";

export default async function Experience() {
  const locale = await getLocale();
  const isRTL = locale === "ar";

  if (experiencesData.length === 0) return null;

  return <ExperienceClient experiences={experiencesData} isRTL={isRTL} />;
}
