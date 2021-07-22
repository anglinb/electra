import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '../../server/type-defs'
import resolvers from '../../server/resolvers'

export const config = {
  api: {
    bodyParser: false
  }
}

import prisma from '../../server/prisma'
import { buildContext } from '../../server/context'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: buildContext({ prisma }),
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
