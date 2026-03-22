
import { db } from "./src/db";
import { projects } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function check() {
  const p = await db.query.projects.findFirst({
    where: eq(projects.slug, "the-drive-center")
  });
  console.log(JSON.stringify(p, null, 2));
  process.exit(0);
}

check();
