import { Resolvers } from '../generated/schema'
import { Context } from './types'

export const resolverVersion = 'test'
const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return `version: ${resolverVersion} 9`
    },
    test: () => {
      return `test`
    },
    viewer: async (parent, _args, ctx, info) => {
      if (ctx.user) {
        return {
          name: ctx.user?.name!
        }
      }
      return null
    }
  },
  User: {
    name: async (parent, _args, ctx, info) => {
      return parent.name
    }
  }
}

export default resolvers
