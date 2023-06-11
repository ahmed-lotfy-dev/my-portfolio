// import { PrismaClient } from "@prisma/client"

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["query"],
//   })

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

import { PrismaClient } from "@prisma/client"

export class Prisma {
  public static Prisma: PrismaClient

  static getPrisma() {
    // create a new instance of PrismaClient if one isn't already created
    this.Prisma ||= new PrismaClient()
    return this.Prisma
  }
}
