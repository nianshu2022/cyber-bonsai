import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return new NextResponse(
    JSON.stringify({
      ok: true,
      message: "Hello from Cloudflare Edge!",
      time: new Date().toISOString(),
      envKeys: Object.keys(process?.env || {}).filter(k => k !== "ADMIN_PASSWORD"), // safe list
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
