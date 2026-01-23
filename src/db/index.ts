import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const getSslConfig = () => {
  const cert = process.env.POSTGRES_SSL_CERT;
  if (!cert) return { rejectUnauthorized: false };

  try {
    // Defensively clean the string of quotes/newlines that Docker/Dokploy might add
    const cleanCert = cert.trim().replace(/^["']|["']$/g, "").replace(/\s/g, "");
    const ca = Buffer.from(cleanCert, "base64").toString("utf-8");

    return {
      rejectUnauthorized: false,
      ca,
    };
  } catch (error) {
    console.error("Critical: Failed to parse POSTGRES_SSL_CERT:", error);
    return { rejectUnauthorized: false };
  }
};

const sslConfig = getSslConfig();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle(pool, { schema })
