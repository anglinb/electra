import { Resolvers } from '../generated/schema'
import { Context } from './types'

export const resolverVersion = 'test'
const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return `version: ${resolverVersion} 9`
    },
    test: () => {
      return `test number 1`
    },
    viewer: async (parent, _args, ctx, info) => {
      if (ctx.user) {
        return {
          ...ctx.user
        }
      }
      return null
    },
    drinkOfTheDay: () => {
      return 'Mojito'
    }
  },
  User: {
    name: (parent) => parent.name,
    image: (parent) => parent.image
  }
}

export default resolvers
