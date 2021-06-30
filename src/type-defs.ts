// import { readFileSync } from 'fs';
// import { join } from 'path';

// // we must convert the file Buffer to a UTF-8 string
// const typeDefs = readFileSync(join(__dirname, './schema.graphql')).toString('utf-8');
// export default typeDefs;

import * as Schema from "./graphql/schema.graphql"
export default Schema;