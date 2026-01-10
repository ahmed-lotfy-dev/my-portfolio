import { getLocale } from "next-intl/server";
import { getExperiences } from "@/src/app/actions/experienceActions";
import ExperienceClient from "./ExperienceClient";

export default async function Experience() {
  const experiences = await getExperiences(true);
  const locale = await getLocale();
  const isRTL = locale === "ar";

  if (experiences.length === 0) return null;

  return <ExperienceClient experiences={experiences} isRTL={isRTL} />;
}
