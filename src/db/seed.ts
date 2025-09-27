import "dotenv/config"
import { db } from "@/src/db"
import { certificates, projects } from "../db/schema"
import { certificatesData } from "@/db-seed-data/certificates-data"
import { projectsData } from "@/db-seed-data/prjects-data"

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
    }))
  )

  console.log("✅ Seeding finished.")
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
