import { Resolvers } from './generated/graphql';

export const resolverVersion = 'test';
const resolvers: Resolvers = {
    Query: {
        hello: () => { 
            return `version: ${resolverVersion} 4`
        },
        viewer: async () => {
            return {
               firstName: 'ffewfweew helfdelo few Jfewustin' 
            }
        }
    },
    User: {
        firstName: async () => {
            return 'Bfewrianfewewe fewe 1234 345 345 329045'
        }
    }
}; 

export default resolvers;
// if (module.hot) {

//     module.hot.accept();
//     module.hot.dispose(() => {
//         console.log('disposing resolvers')
//     })
// }

