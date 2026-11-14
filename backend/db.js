import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Defina DATABASE_URL no arquivo backend/.env.");
}

export const banco = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});
