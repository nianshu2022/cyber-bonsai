/**
 * Cloudflare D1 Database Helper
 * Handles reading and writing bonsai state for users.
 */

// Define interface matching D1 schema
export interface BonsaiRecord {
  username: string;
  level: number;
  xp: number;
  last_commit_count: number;
  last_updated: string;
}

// Declare the type for D1 Database in Cloudflare env bindings
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB?: import("@cloudflare/workers-types").D1Database;
    }
  }
}

/**
 * Get D1 database binding safely.
 */
function getDb() {
  const db = process.env.DB;
  if (!db) {
    // If not found, log warning (occurs during local build outside Pages env)
    console.warn("Cloudflare D1 Database binding 'DB' is not available in the current environment.");
  }
  return db;
}

/**
 * Fetch a user's bonsai record from the database.
 */
export async function getBonsaiRecord(username: string): Promise<BonsaiRecord | null> {
  const db = getDb();
  if (!db) return null;

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
  if (!db) return;

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
