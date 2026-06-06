import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log("Resetting public schema...");

    await sql`DROP SCHEMA IF EXISTS public CASCADE;`;
    await sql`CREATE SCHEMA public;`;

    console.log("Restoring permissions...");

    await sql`GRANT ALL ON SCHEMA public TO public;`;
    await sql`GRANT ALL ON SCHEMA public TO neondb_owner;`;

    await sql`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO public;`;
    await sql`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO public;`;
    await sql`GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO public;`;

    await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO public;`;
    await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO public;`;
    await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO public;`;

    const result = await sql`
      SELECT schema_name 
      FROM information_schema.schemata
      ORDER BY schema_name;
    `;

    console.log(
      "Schemas found:",
      result.map((r) => r.schema_name),
    );
    console.log("Database reset completed.");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

main();
