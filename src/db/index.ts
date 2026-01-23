import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const sslConfig = process.env.POSTGRES_SSL_CERT
  ? {
    rejectUnauthorized: false, // Set to false to allow self-signed certs (e.g. Dokploy/IP connections)
    ca: Buffer.from(process.env.POSTGRES_SSL_CERT, "base64").toString("utf-8"),
  }
  : {
    rejectUnauthorized: false, // Still uses SSL even without a specific CA
  }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle(pool, { schema })
