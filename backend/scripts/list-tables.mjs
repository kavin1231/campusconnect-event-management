import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rows } = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log(rows.map((r) => r.table_name).join("\n"));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
