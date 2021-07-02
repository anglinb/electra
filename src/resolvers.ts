import { Resolvers } from './generated/graphql'

type Context = {
  user?: {
    firstName?: string
  }
}

export const resolverVersion = 'test'
const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return `version: ${resolverVersion} 5`
    },
    test: () => {
      return `test`
    },
    viewer: async (parent, _args, ctx, info) => {
      return {
        firstName: ctx.user?.firstName!
      }
    }
  },
  User: {
    firstName: async (parent, _args, ctx, info) => {
      return parent.firstName
    }
  }
}

export default resolvers
