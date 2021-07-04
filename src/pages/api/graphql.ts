import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '../../server/type-defs'
import resolvers from '../../server/resolvers'
import cookie from 'cookie'
import { Context } from '../../server/types'
import { PrismaClient, User } from '@prisma/client'

export const config = {
  api: {
    bodyParser: false
  }
}

import prisma from '../../server/prisma'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<Context> => {
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
  },
  playground: {
    settings: {
      'request.credentials': 'same-origin'
    }
  },
  tracing: true
})

let handler = apolloServer.createHandler({
  path: '/api/graphql'
})

export default async function (...args: any) {
  // @ts-ignore
  let resp = await handler(...args)
  return resp
}
