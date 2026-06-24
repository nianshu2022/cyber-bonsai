import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // Safe check for process.env to prevent ReferenceError in strict Edge runtime
  const safeEnv = typeof process !== "undefined" && process.env ? process.env : {};
  const envKeys = Object.keys(safeEnv).filter(k => k !== "ADMIN_PASSWORD");

  return new NextResponse(
    JSON.stringify({
      ok: true,
      message: "Hello from Cloudflare Edge!",
      time: new Date().toISOString(),
      envKeys,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
