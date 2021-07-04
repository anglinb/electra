import { PrismaClient } from '@prisma/client'

// @ts-ignore
let prisma: PrismaClient = undefined

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({
      log: [
        {
          emit: 'stdout',
          level: 'query'
        },
        {
          emit: 'stdout',
          level: 'error'
        },
        {
          emit: 'stdout',
          level: 'info'
        },
        {
          emit: 'stdout',
          level: 'warn'
        }
      ]
    })
  }

  // @ts-ignore
  prisma = global.prisma
}

export default prisma
