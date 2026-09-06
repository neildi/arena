import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "aurelia.db");

declare global {
  // eslint-disable-next-line no-var
  var __aureliaDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __aureliaSeeded: boolean | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  const schema = fs.readFileSync(
    path.join(process.cwd(), "src", "lib", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);
  return db;
}

export function getDb(): Database.Database {
  if (!global.__aureliaDb) {
    global.__aureliaDb = createConnection();
  }
  if (!global.__aureliaSeeded) {
    global.__aureliaSeeded = true;
    const db = global.__aureliaDb;
    const row = db
      .prepare("SELECT value FROM meta WHERE key = 'seeded'")
      .get() as { value: string } | undefined;
    if (row?.value !== "true") {
      // Lazy require to avoid a hard circular import at module-eval time.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { runSeed } = require("./seed/index") as typeof import("./seed/index");
      runSeed(db);
      db.prepare(
        "INSERT INTO meta (key, value) VALUES ('seeded','true') ON CONFLICT(key) DO UPDATE SET value='true'"
      ).run();
    }
  }
  return global.__aureliaDb;
}
