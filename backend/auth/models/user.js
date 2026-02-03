import { pool } from "./db.js";

export async function findByEmail(email) {
  const result = await pool.query("SELECT id, name, email, password FROM auth.users WHERE email = $1", [email]);
  return result.rows[0] ?? null;
}

export async function findById(id) {
  const result = await pool.query("SELECT id, name, email, password FROM auth.users WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function create({ name, email, password }) {
  const result = await pool.query(
    "INSERT INTO auth.users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, password]
  );
  return result.rows[0];
}
