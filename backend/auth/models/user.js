import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function findByEmail(email) {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0] ?? null;
}

export async function findById(id) {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function create({ name, email, password }) {
  const [row] = await db
    .insert(users)
    .values({ name, email, password })
    .returning({ id: users.id, name: users.name, email: users.email });
  return row;
}
