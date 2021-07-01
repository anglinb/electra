import http from 'http';
import express from 'express'
// const requestIp = require('request-ip');

import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'

const typeDefs = require('./typeDefs').default
const resolvers = require('./resolvers').default


// import getUserByToken from './getUserByToken';


const app = express();



const PORT = 4000;

// app.use(requestIp.mw())


const server = new ApolloServer({ 
	typeDefs,
	resolvers,
	// subscriptions: {

	// 	onConnect: (connectionParams, webSocket) => {
	// 		console.log("onConnect server")
	// 		if (connectionParams.authToken) {
	// 			return getUserByToken(connectionParams.authToken, "user")
	// 				.then(user => {
	// 					// console.log('then -> ' + user.id)
	// 					return {
	// 						currentUser: user.dataValues,
	// 					};
	// 				})
	// 				.catch(error => {
	// 					console.log('error index.js server onConnect auth: ' + error)
	// 				});
	// 		}

	// 		throw new Error('Missing auth token!');
	// 	}
	// },
	// context: ({ req }) => {

	// 	// const ip = req.clientIp;
	// 	// console.log('ip: ' + ip)
	// 	req.headers.ip = req.clientIp

	// 	return req.headers
	// },
});

// THE MAGIC HAPPENS HERE <3
app.use('/graphql', (req, res, next) => {

		const typeDefs = require('./typeDefs').default
		const resolvers = require('./resolvers').default

		const schema = makeExecutableSchema({ typeDefs, resolvers })
		// console.log(schema)
    server.schema = schema
    next();
})

server.applyMiddleware({ app });


const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})


let currentApp = app

if (module.hot) {

// add whatever file you wanna watch 
	module.hot.accept(['./index', './typeDefs', './resolvers'], () => {
		httpServer.removeListener('request', currentApp);
		httpServer.on('request', app);
		currentApp = app;
	});
}
