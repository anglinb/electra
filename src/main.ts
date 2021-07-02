import http from 'http'
import express from 'express'
// import console from 'chalk-console';
import { ApolloServer } from 'apollo-server-express'

// import { LocalStorage } from 'node-localstorage';
import { PubSub } from 'apollo-server'

// const localStorage = new LocalStorage('./data');
// const pubsub = new PubSub();

const typeDefs = require('./type-defs').default
const resolvers = require('./resolvers').default
// (localStorage, pubsub);

const PORT = process.env.PORT || 4000

const configureHttpServer = (httpServer: http.Server) => {
  console.info('Creating Express app')
  const expressApp = express()

  expressApp.get('/', (req: express.Request, res: express.Response) => {
    res.redirect('/graphql')
  })

  console.info('Creating Apollo server')
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: express.Request }) => {
      const user = {
        firstName: 'Brian'
      }

      return {
        user
      }
    }
  })

  apolloServer.applyMiddleware({
    app: expressApp
  })

  console.info('Express app created with Apollo middleware')

  httpServer.on('request', expressApp)
  apolloServer.installSubscriptionHandlers(httpServer)
}

// @ts-ignore
if (!process.httpServer) {
  console.info('Creating HTTP server')

  // @ts-ignore
  process.httpServer = http.createServer()

  // @ts-ignore
  configureHttpServer(process.httpServer)

  // @ts-ignore
  process.httpServer.listen(PORT, () => {
    console.info(`HTTP server ready at http://localhost:${PORT}`)
    console.info(`Websocket server ready at ws://localhost:${PORT}`)
  })
} else {
  console.info('Reloading HTTP server')
  // @ts-ignore
  process.httpServer.removeAllListeners('upgrade')
  // @ts-ignore
  process.httpServer.removeAllListeners('request')

  // @ts-ignore
  configureHttpServer(process.httpServer)

  console.info('HTTP server reloaded')
}

if (module.hot) {
  module.hot.accept()
}

// import { gql, ServerInfo } from 'apollo-server';
// import http from 'http';
// import { ApolloServer } from 'apollo-server';

// import version from './version';
// import resolvers, { resolverVersion } from './resolvers';
// import typeDefs from './type-defs';

// let httpServer: http.Server | undefined = undefined;
// let server: ApolloServer | undefined = undefined;

// const query = gql`
// query {
// 	hello
// }
// `;

// const boot = () => {

// 	console.log('boot resolver version', resolverVersion)
// 	console.log('boot version', version)
// 	server = new ApolloServer({
// 			resolvers,
// 			typeDefs,
// 			cacheControl:{
// 				defaultMaxAge: 0
// 			},

// 			// tracing: true,
// 			playground:{
// 			}
// 	})
// 	server.listen().then(async (info: ServerInfo) => {
// 		httpServer = info.server;

// 		let resp = await server!.executeOperation({ query })
// 		console.log('resp', resp)
// 	})
// }

// boot();

// console.log('main resolver version', resolverVersion)
// console.log('main file ', version)
// if (module.hot) {
// 		module.hot.accept()
//     module.hot.dispose(() => {
// 		console.log('dispose', version)
//       console.log('stopping listening', resolvers);
// 			console.log('dispose resolver version', resolverVersion)
// 			httpServer?.close();
// 			// boot();
//       console.log('Module disposed. ');
//     });
// }
