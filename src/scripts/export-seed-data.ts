import "dotenv/config";
import { db } from "../db/index";
import { projects, experiences } from "../db/schema";
import { desc } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function exportSeedData() {
  console.log("📤 Exporting projects and experiences from database...");

  try {
    // Export Experiences
    const allExperiences = await db
      .select()
      .from(experiences)
      .orderBy(desc(experiences.displayOrder));

    const expFormatted = allExperiences.map((exp) => ({
      company: exp.company,
      role_en: exp.role_en,
      role_ar: exp.role_ar,
      date_en: exp.date_en,
      date_ar: exp.date_ar,
      description_en: exp.description_en,
      description_ar: exp.description_ar,
      tech_stack: exp.tech_stack,
      displayOrder: exp.displayOrder,
      published: exp.published,
    }));

    const expFileContent = `export const experiencesSeedData = ${JSON.stringify(expFormatted, null, 2)};\n`;
    fs.writeFileSync(
      path.join(process.cwd(), "src/db/db-seed-data/experiences-seed.ts"),
      expFileContent
    );
    console.log(`✅ Exported ${allExperiences.length} experiences.`);

    // Note: Projects are modularized in the project, so a single export script 
    // might need to split them or we can just export them as a single object 
    // for a "backup" seed file. 
    // For simplicity, let's create a backup of projects.
    const allProjects = await db.select().from(projects).orderBy(desc(projects.displayOrder));
    const projectsFileContent = `export const projectsBackupData = ${JSON.stringify(allProjects, null, 2)};\n`;
    fs.writeFileSync(
      path.join(process.cwd(), "src/db/db-seed-data/projects-backup.ts"),
      projectsFileContent
    );
    console.log(`✅ Exported ${allProjects.length} projects to projects-backup.ts.`);

  } catch (error) {
    console.error("❌ Error exporting seed data:", error);
  } finally {
    process.exit(0);
  }
}

exportSeedData();
