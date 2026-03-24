
import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Respect PGSSLMODE for local/plaintext setups; default to SSL with relaxed cert check for hosted DBs like Neon.
const sslMode = process.env.PGSSLMODE?.toLowerCase();
const ssl = sslMode === "disable" ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString,
  ssl,
  connectionTimeoutMillis: 10_000,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter: new PrismaPg(pool),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
