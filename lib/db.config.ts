import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __db__prisma: PrismaClient | undefined
}

const prisma = global.__db__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__db__prisma = prisma
}

export { prisma } 