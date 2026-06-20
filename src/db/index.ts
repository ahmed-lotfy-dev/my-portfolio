import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL || "";

// Strip sslmode from connection string — self-hosted Postgres has no SSL
const cleanUrl = connectionString
  .replace(/[?&]sslmode=require/gi, "")
  .replace(/[?&]sslmode=verify-full/gi, "")
  .replace(/[?&]sslmode=verify-ca/gi, "")
  .replace(/[?&]sslmode=disable/gi, "")
  .replace(/[?&]ssl=true/gi, "")
  .replace(/[?&]ssl=1/gi, "");

const pool = new Pool({
  connectionString: cleanUrl || undefined,
})

export const db = drizzle(pool, { schema })
