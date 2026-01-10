import "dotenv/config"
import { db } from "@/src/db/index"
import { certificates, projects, experiences, users } from "@/src/db/schema"
import { certificatesData } from "@/src/db/db-seed-data/certificates-data"
import { projectsSeedData } from "@/src/db/db-seed-data/projects-seed"
import { experiencesSeedData } from "@/src/db/db-seed-data/experiences-seed"
import { auth } from "../lib/auth"
import { eq } from "drizzle-orm"

async function seed() {
  console.log("🌱 Seeding started...")

  // Check if the admin user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, "elshenawy19@gmail.com"))

  if (existingUser.length === 0) {
    // Create the admin user if it doesn't exist
    await auth.api.signUpEmail({
      body: {
        email: "elshenawy19@gmail.com",
        password: "ahmedlotfy",
        name: "Ahmed Lotfy",
      },
    });
    // Set the user's role to admin
    await db
      .update(users)
      .set({ role: "ADMIN" })
      .where(eq(users.email, "elshenawy19@gmail.com"));

    console.log("Admin user created and assigned admin role.");
  } else {
    console.log("Admin user already exists.")
  }

  // Clear tables
  await db.delete(certificates)
  await db.delete(projects)
  await db.delete(experiences)

  // Insert certificates
  await db.insert(certificates).values(
    certificatesData.map((cert) => ({
      title: cert.title,
      desc: cert.desc,
      courseLink: cert.courseLink,
      profLink: cert.profLink,
      imageLink: cert.imageLink,
      completedAt: cert.completedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )

  // Insert projects
  await db.insert(projects).values(
    projectsSeedData.map((project, index) => ({
      title_en: project.title_en,
      title_ar: project.title_ar,
      slug: project.slug,
      desc_en: project.desc_en,
      desc_ar: project.desc_ar,
      content_en: project.content_en,
      content_ar: project.content_ar,
      coverImage: project.coverImage,
      liveLink: project.liveLink,
      repoLink: project.repoLink,
      categories: project.categories,
      displayOrder: project.displayOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )

  // Insert experiences
  await db.insert(experiences).values(
    experiencesSeedData.map((exp) => ({
      company: exp.company,
      role_en: exp.role_en,
      role_ar: exp.role_ar,
      description_en: exp.description_en,
      description_ar: exp.description_ar,
      date_en: exp.date_en,
      date_ar: exp.date_ar,
      tech_stack: exp.tech_stack,
      displayOrder: exp.displayOrder,
      published: exp.published,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )

  console.log("✅ Seeding finished.")
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
