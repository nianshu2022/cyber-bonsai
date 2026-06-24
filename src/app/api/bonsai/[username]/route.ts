import { NextRequest, NextResponse } from "next/server";
import { getBonsaiRecord, upsertBonsaiRecord } from "@/lib/db";
import { fetchGithubActivityCount } from "@/lib/github";
import { generateBonsaiSVG } from "@/lib/svg-generator";

export const runtime = "edge";

// Helper to determine Level and XP based on rolling 7-day activities
function calculateGrowth(commits: number) {
  const xp = commits * 10;
  let level = 0;
  let maxXp = 20;

  if (xp >= 200) {
    level = 4; // Blooming
    maxXp = 200;
  } else if (xp >= 100) {
    level = 3; // Bonsai
    maxXp = 200;
  } else if (xp >= 50) {
    level = 2; // Growing
    maxXp = 100;
  } else if (xp >= 20) {
    level = 1; // Sapling
    maxXp = 50;
  } else {
    level = 0; // Sprout
    maxXp = 20;
  }

  return { level, xp, maxXp, isDry: commits === 0 };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const resolvedParams = await params;
  const username = resolvedParams?.username;

  if (!username) {
    return new NextResponse("Username required", { status: 400 });
  }

  const cleanUsername = username.toLowerCase();
  const now = new Date();

  let record = await getBonsaiRecord(cleanUsername);
  let commitCount = 0;
  let shouldUpdate = false;

  if (record) {
    commitCount = record.last_commit_count;
    // Check if the record was updated more than 30 minutes ago
    const lastUpdatedDate = new Date(record.last_updated);
    const diffMs = now.getTime() - lastUpdatedDate.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes > 30) {
      shouldUpdate = true;
    }
  } else {
    // First time visitor
    shouldUpdate = true;
  }

  if (shouldUpdate) {
    try {
      // Pull fresh data from GitHub
      commitCount = await fetchGithubActivityCount(cleanUsername);
      const growth = calculateGrowth(commitCount);
      
      // Save/update to D1 Database
      await upsertBonsaiRecord(cleanUsername, growth.level, growth.xp, commitCount);
      
      // Update local record representation
      record = {
        username: cleanUsername,
        level: growth.level,
        xp: growth.xp,
        last_commit_count: commitCount,
        last_updated: now.toISOString(),
      };
    } catch (err: any) {
      console.error(`Failed to update activity for ${cleanUsername}:`, err);
      // Fallback: if we hit API errors or database is down, try to use old record if it exists
      if (!record) {
        // Mock a level 0 record if we don't even have a database entry
        record = {
          username: cleanUsername,
          level: 0,
          xp: 0,
          last_commit_count: 0,
          last_updated: now.toISOString(),
        };
      }
    }
  }

  // Calculate rendering parameters
  const growth = calculateGrowth(commitCount);
  const svg = generateBonsaiSVG({
    username: cleanUsername,
    level: record!.level,
    xp: record!.xp,
    maxXp: growth.maxXp,
    commitCount: commitCount,
    lastUpdated: record!.last_updated,
    isDry: growth.isDry,
  });

  // Return SVG with correct Headers and caching policies
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      // Cache-Control: Cache for 30 minutes in browser, 1 hour on CDN
      "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
