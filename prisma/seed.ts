import { PrismaClient } from "@prisma/client"
import { certificatesData } from "@/db-seed-data/certificates-data"
import { projectsData } from "@/db-seed-data/prjects-data"

const prisma = new PrismaClient()

async function seed() {
  console.log("Deleting all tables")
  console.log("Seeding Started...")
  const certificates = await prisma.certificate.createMany({
    data: certificatesData.map((cert) => ({
      title: cert.title,
      desc: cert.desc,
      courseLink: cert.courseLink,
      profLink: cert.profLink,
      imageLink: cert.imageLink,
    })),
  })
  const projects = await prisma.project.createMany({
    data: projectsData.map((project) => ({
      title: project.title,
      desc: project.desc,
      imageLink: project.imageLink,
      liveLink: project.liveLink,
      repoLink: project.repoLink,
      categories: project.categories,
    })),
  })
}

try {
  await seed()
  console.log("Seeding Finished...")
  await prisma.$disconnect()
} catch (e) {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
}

// put
// "type": "module",
// inside package.json to run without error top level await then remove it to run the app normally
