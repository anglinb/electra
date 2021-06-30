import { Resolvers } from './generated/graphql';

const resolvers: Resolvers = {
    Query: {
        hello: () => { 
            console.log(' fewfew');
            return 'world'
        }
    }
};

export default resolvers;