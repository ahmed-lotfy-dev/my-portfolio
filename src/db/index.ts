import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const getSslConfig = () => {
  // We force SSL for security, but set rejectUnauthorized to false 
  // because we are connecting via IP and using self-signed certs.
  return { rejectUnauthorized: false };
};

const sslConfig = getSslConfig();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle(pool, { schema })
