import { db } from "@/src/db";
import { certificates, projects } from "./schema";
import { certificatesData } from "@/src/db/db-seed-data/certificates-data";
import { projectsSeedData } from "@/src/db/db-seed-data/projects-seed";

async function seed() {
  console.log("Seeding Started...");

  console.log("Deleting all tables");
  await db.delete(certificates);
  await db.delete(projects);

  console.log("Seeding certificates");
  await db.insert(certificates).values(
    certificatesData.map((cert: any) => ({
      title: cert.title,
      desc: cert.desc,
      courseLink: cert.courseLink,
      profLink: cert.profLink,
      imageLink: cert.imageLink,
    }))
  );

  console.log("Seeding projects");
  await db.insert(projects).values(
    projectsSeedData.map((project: any) => ({
      titleEn: project.title_en,
      titleAr: project.title_ar,
      descEn: project.desc_en,
      descAr: project.desc_ar,
      contentEn: project.content_en,
      contentAr: project.content_ar,
      slug: project.slug,
      imageLink: project.imageLink,
      liveLink: project.liveLink,
      repoLink: project.repoLink,
      categories: project.categories,
      displayOrder: project.displayOrder,
    }))
  );

  console.log("Seeding Finished...");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
