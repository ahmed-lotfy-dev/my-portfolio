import "dotenv/config"
import { db } from "@/src/db/index"
import { certificates, projects } from "@/src/db/schema"
import { certificatesData } from "@/src/db/db-seed-data/certificates-data"
import { projectsData } from "@/src/db/db-seed-data/prjects-data"

async function seed() {
  console.log("🌱 Seeding started...")

  // Clear tables
  await db.delete(certificates)
  await db.delete(projects)

  // Insert certificates
  await db.insert(certificates).values(
    certificatesData.map((cert) => ({
      title: cert.title,
      desc: cert.desc,
      courseLink: cert.courseLink,
      profLink: cert.profLink,
      imageLink: cert.imageLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  )

  // Insert projects
  await db.insert(projects).values(
    projectsData.map((project) => ({
      title: project.title,
      desc: project.desc,
      imageLink: project.imageLink,
      liveLink: project.liveLink,
      repoLink: project.repoLink,
      categories: project.categories,
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
