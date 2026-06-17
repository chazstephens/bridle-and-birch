import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from trying to bundle native-addon packages.
  // better-sqlite3 is a Node.js native module (.node binary) used only in local
  // dev when DATABASE_URL is a file: path. Marking it external tells Next.js to
  // require() it at runtime from node_modules instead of inlining it into the bundle.
  serverExternalPackages: [
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
  ],
};

export default nextConfig;
