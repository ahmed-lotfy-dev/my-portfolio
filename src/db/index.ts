import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as posts from "./schema/posts";
import * as projects from "./schema/projects";
import * as certificates from "./schema/certificates";
import * as users from "./schema/users";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const schema = { ...users, ...projects, ...certificates, ...posts };

async function main() {
  return await client.connect();
}
main();

export const db: NodePgDatabase<typeof schema> = drizzle(client, { schema });

// import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
// import postgres from "postgres";

// const connectionString = process.env.DATABASE_URL as string;

// const migrationClient = postgres(connectionString, { max: 1 });

// migrate(drizzle(migrationClient), { migrationsFolder: "./migrations" });

// const schema = { ...users, ...projects, ...certificates, ...posts };

// const queryClient = postgres(connectionString);
// export const db = drizzle(queryClient, { schema });
