import { db } from "@/src/db";
import { certificates, projects } from "./schema";
import { certificatesData } from "@/src/db/db-seed-data/certificates-data";
import { projectsData } from "@/src/db/db-seed-data/prjects-data";

async function seed() {
  console.log("Seeding Started...");

  console.log("Deleting all tables");
  await db.delete(certificates);
  await db.delete(projects);

  console.log("Seeding certificates");
  await db.insert(certificates).values(
    certificatesData.map((cert) => ({
      title: cert.title,
      desc: cert.desc,
      courseLink: cert.courseLink,
      profLink: cert.profLink,
      imageLink: cert.imageLink,
    }))
  );

  console.log("Seeding projects");
  await db.insert(projects).values(
    projectsData.map((project) => ({
      titleEn: project.title,
      titleAr: project.title,
      descEn: project.desc,
      descAr: project.desc,
      imageLink: project.imageLink,
      liveLink: project.liveLink,
      repoLink: project.repoLink,
      categories: project.categories,
    }))
  );

  console.log("Seeding Finished...");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
