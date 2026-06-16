import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? "";

  if (connectionString.startsWith("file:")) {
    // Local SQLite — PrismaBetterSqlite3 takes { url } and handles Database init internally
    const adapter = new PrismaBetterSqlite3({ url: connectionString });
    return new PrismaClient({ adapter });
  }

  // PostgreSQL (production / Supabase)
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
