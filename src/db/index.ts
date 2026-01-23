import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const sslConfig = process.env.POSTGRES_SSL_CERT
  ? {
      rejectUnauthorized: false,
      ca: Buffer.from(process.env.POSTGRES_SSL_CERT, "base64").toString("utf-8"),
    }
  : {
      rejectUnauthorized: false,
    }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle(pool, { schema })
