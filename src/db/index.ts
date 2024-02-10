import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as posts from "./schema/posts";
import * as projects from "./schema/projects";
import * as certificates from "./schema/certificates";
import * as users from "./schema/users";

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = { ...users, ...projects, ...certificates, ...posts };

async function main() {
  return await client.connect();
}
main();

export const db: NodePgDatabase<typeof schema> = drizzle(client, { schema });