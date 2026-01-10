import "dotenv/config";
import { db } from "../db/index";
import { certificates } from "../db/schema";
import { desc } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function exportCertificates() {
  console.log("📤 Exporting certificates from database...");

  try {
    const allCertificates = await db
      .select()
      .from(certificates)
      .orderBy(desc(certificates.completedAt));

    const formattedData = allCertificates.map((cert) => ({
      title: cert.title,
      desc: cert.desc,
      courseLink: cert.courseLink,
      profLink: cert.profLink,
      imageLink: cert.imageLink,
      completedAt: cert.completedAt ? `new Date("${cert.completedAt.toISOString().split('T')[0]}")` : null,
      published: cert.published,
    }));

    const fileContent = `export const certificatesData = ${JSON.stringify(formattedData, null, 2).replace(/"new Date\(\\"(.*?)\\"\)"/g, 'new Date("$1")')};
`;

    const outputPath = path.join(process.cwd(), "src/db/db-seed-data/certificates-data.ts");
    fs.writeFileSync(outputPath, fileContent);

    console.log(`✅ Successfully exported ${allCertificates.length} certificates to ${outputPath}`);
  } catch (error) {
    console.error("❌ Error exporting certificates:", error);
  } finally {
    process.exit(0);
  }
}

exportCertificates();
