import { ApolloServer } from 'apollo-server-micro'
import typeDefs from './type-defs'
import resolvers from './resolvers'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    console.log('got context')
    //     const user = {
    //       firstName: 'Brian'
    //     }

    //     return {
    //       user
    //     }
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer
