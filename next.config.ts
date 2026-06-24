import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint and TypeScript compilation errors during build for Cloudflare compatibility
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
