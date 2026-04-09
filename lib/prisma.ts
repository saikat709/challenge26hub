import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { PrismaClient } from '@/prisma/generated/client'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Missing database connection string. Set DIRECT_URL or DATABASE_URL in .env.')
}

const adapter = new PrismaNeonHttp(connectionString, {})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma