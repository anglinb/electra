import { User, PrismaClient } from '@prisma/client'
import cookie from 'cookie'

import { Context } from './types'

import { ContextFunction } from 'apollo-server-core'
import { MicroRequest } from 'apollo-server-micro/dist/types'

type MicroRequestParams = {
  req: MicroRequest
}

export const buildContext = ({
  prisma
}: {
  prisma: PrismaClient
}): ContextFunction<MicroRequestParams, Context> => {
  const context: ContextFunction<MicroRequestParams, Context> = async ({
    req
  }): Promise<Context> => {
    let authorizationToken: string | undefined = undefined // Try and load it from cookies
    let user: User | undefined = undefined
    if (req.headers['cookie']) {
      let cookies = cookie.parse(req.headers['cookie'])
      let sessionCookie =
        cookies[`__Secure-next-auth.session-token`] ||
        (process.env.NODE_ENV === 'development'
          ? cookies['next-auth.session-token']
          : undefined)
      if (sessionCookie && sessionCookie.length > 0) {
        authorizationToken = sessionCookie
      }
    }

    // Try and load it from headers
    if (!authorizationToken) {
      authorizationToken = (req.headers['authorization'] || '')
        .replace('Bearer', '')
        .trim()
    }

    // Actually look up the authorization token
    if (!authorizationToken) {
      return {
        prisma
      }
    }
    const session = await prisma.session.findUnique({
      where: { sessionToken: authorizationToken }
    })
    if (session && session.expires < new Date()) {
      await prisma.session.delete({
        where: { sessionToken: authorizationToken }
      })
    }
    if (session && session.expires > new Date()) {
      user =
        (await prisma.user.findUnique({
          where: {
            id: session.userId
          }
        })) || undefined
    }

    return {
      prisma,
      user
    }
  }

  return context
}
