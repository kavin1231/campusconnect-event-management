import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

function parseUrl(url) {
  const u = new URL(url);
  return {
    protocol: u.protocol,
    username: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    host: u.hostname,
    port: Number(u.port || 5432),
    database: u.pathname.replace(/^\//, ""),
  };
}

const cfg = parseUrl(process.env.DATABASE_URL);

async function listTablesForDb(dbName) {
  const pool = new Pool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.username,
    password: cfg.password,
    database: dbName,
  });

  try {
    const current = await pool.query("SELECT current_database() AS db");
    const schemas = await pool.query(
      "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name"
    );
    const tables = await pool.query(
      `SELECT table_schema, table_name
       FROM information_schema.tables
       WHERE table_type = 'BASE TABLE'
       ORDER BY table_schema, table_name`
    );

    return {
      db: current.rows[0].db,
      schemas: schemas.rows.map((r) => r.schema_name),
      tables: tables.rows,
    };
  } finally {
    await pool.end();
  }
}

async function main() {
  const adminPool = new Pool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.username,
    password: cfg.password,
    database: "postgres",
  });

  try {
    const dbs = await adminPool.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname"
    );

    console.log("Configured DATABASE_URL DB:", cfg.database);
    console.log("Available databases:", dbs.rows.map((r) => r.datname).join(", "));

    for (const row of dbs.rows) {
      const dbName = row.datname;
      try {
        const info = await listTablesForDb(dbName);
        const interesting = info.tables.filter((t) =>
          [
            "Event",
            "MerchandiseProduct",
            "MerchandiseOrder",
            "User",
            "Student",
            "EventRequest",
          ].includes(t.table_name)
        );

        console.log(`\n=== ${info.db} ===`);
        console.log("Schemas:", info.schemas.join(", "));
        console.log("Total tables:", info.tables.length);
        if (interesting.length) {
          console.log(
            "Interesting tables:",
            interesting.map((t) => `${t.table_schema}.${t.table_name}`).join(", ")
          );
        } else {
          console.log("Interesting tables: none");
        }
      } catch (e) {
        console.log(`\n=== ${dbName} ===`);
        console.log("Unable to inspect:", e.message);
      }
    }
  } finally {
    await adminPool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
