/**
 * Cloudflare D1 Database Helper
 * Handles reading and writing bonsai state for users safely in Edge and Node runtimes.
 */
import { getRequestContext } from "@cloudflare/next-on-pages";
import { D1Database } from "@cloudflare/workers-types";

// Define interface matching D1 schema
export interface BonsaiRecord {
  username: string;
  level: number;
  xp: number;
  last_commit_count: number;
  last_updated: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB?: D1Database;
    }
  }
}

/**
 * Get D1 database binding safely from Cloudflare Request Context or process.env.
 */
function getDb(): D1Database | undefined {
  let db: D1Database | undefined;

  // 1. Try retrieving from Cloudflare Pages Request Context (Next-on-Pages Edge Runtime)
  try {
    const context = getRequestContext();
    const env = context.env as any;
    if (context && env && env.DB) {
      db = env.DB as D1Database;
    }
  } catch (error) {
    // Fails silently during local Next.js builds or environments outside Cloudflare Pages
  }

  // 2. Fallback to process.env (for local development next dev / wrangler pages dev)
  if (!db) {
    try {
      if (typeof process !== "undefined" && process.env && process.env.DB) {
        db = process.env.DB;
      }
    } catch (error) {
      // Fails silently if process is not defined in strict Edge environments without nodejs_compat
    }
  }

  return db;
}

/**
 * Fetch a user's bonsai record from the database.
 */
export async function getBonsaiRecord(username: string): Promise<BonsaiRecord | null> {
  const db = getDb();
  if (!db) {
    console.warn("D1 Database is not available. Skipping read.");
    return null;
  }

  try {
    const record = await db
      .prepare("SELECT * FROM users_bonsai WHERE username = ?")
      .bind(username.toLowerCase())
      .first<BonsaiRecord>();
    return record;
  } catch (error) {
    console.error(`Error querying D1 for user ${username}:`, error);
    return null;
  }
}

/**
 * Insert or update a user's bonsai record.
 */
export async function upsertBonsaiRecord(
  username: string,
  level: number,
  xp: number,
  commitCount: number
): Promise<void> {
  const db = getDb();
  if (!db) {
    console.warn("D1 Database is not available. Skipping write.");
    return;
  }

  try {
    await db
      .prepare(
        `INSERT INTO users_bonsai (username, level, xp, last_commit_count, last_updated)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(username) DO UPDATE SET
           level = EXCLUDED.level,
           xp = EXCLUDED.xp,
           last_commit_count = EXCLUDED.last_commit_count,
           last_updated = CURRENT_TIMESTAMP`
      )
      .bind(username.toLowerCase(), level, xp, commitCount)
      .run();
  } catch (error) {
    console.error(`Error upserting D1 for user ${username}:`, error);
    throw error;
  }
}
