import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "../../../../lib/auth";
import { db } from "../../db";
import * as schema from "../../schema";

async function main() {
  const email = "tjgontijo@gmail.com";
  const password = "senha##123";
  const name = "Thiago Gontijo";

  console.log(`🌱 Seeding user: ${email}...`);

  try {
    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    if (existingUser) {
      console.log("User already exists. Skipping creation.");
      return;
    }

    // Use Better Auth API to create user with hashed password
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (result) {
      console.log("✅ User created successfully via Better Auth API.");

      // Update user to have 'admin' role if needed
      await db
        .update(schema.user)
        .set({ role: "admin" })
        .where(eq(schema.user.email, email));

      console.log("✅ User role updated to 'admin'.");
    }
  } catch (error) {
    console.error("❌ Failed to seed user:");
    console.error(error);
    process.exit(1);
  }
}

main();
