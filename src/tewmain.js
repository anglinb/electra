import { ApolloServer } from 'apollo-server';

import resolvers from './resolvers';
import typeDefs from './type-defs';


const server = new ApolloServer({
    resolvers,
    typeDefs,
    tracing: true
});

server
  .listen()
  .then(({ url }) => console.log(`Server ready at ${url}.`))

if (module.hot) {
    console.log('Got hot update!')
    module.hot.accept();
    module.hot.dispose(() => {
        console.log('stopping')
        server.stop()
    });
}
