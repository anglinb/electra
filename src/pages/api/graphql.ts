import { ApolloServer } from 'apollo-server-micro'
import typeDefs from '../../server/type-defs'
import resolvers from '../../server/resolvers'
import cookie from 'cookie'
// const  apolloServer  =  new  ApolloServer({
// 	typeDefs,
// 	resolvers
// });
import { Context } from '../../server/types'

export const config = {
  api: {
    bodyParser: false
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<Context> => {
    let authorizationToken: string | undefined = undefined
    // Try and load it from cookies
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
      return {}
    }

    return {}
  }
})

let handler = apolloServer.createHandler({ path: '/api/graphql' })

export default async function (...args: any) {
  // @ts-ignore
  let resp = await handler(...args)
  return resp
}
