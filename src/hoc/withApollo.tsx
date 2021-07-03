import { NextPage } from "next";
import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";


import { 
	ApolloLink, 
	from 
} from '@apollo/client';

const timeStartLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });
  return forward(operation);
});

const logTimeLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    // data from a previous link
		// @ts-ignore
    const time = new Date() - operation.getContext().start;
    // console.log(`operation ${operation.operationName} took ${time} to complete`);
		// console.log(`data:`, data)
    return data;
  })
});
import {
  NextApiRequestCookies,
  // @ts-ignore This path is generated at build time and conflicts otherwise
} from 'next-server/server/api-utils';
import { IncomingMessage } from "http";

export type ApolloClientContext = {
  req: IncomingMessage & {
    // Basically just a k/v
    cookies: NextApiRequestCookies
  }
};

export const withApollo = (Comp: NextPage) => (props: any) => {
  return (
    <ApolloProvider client={getApolloClient(undefined, props.apolloState)}>
      <Comp {...props} />
    </ApolloProvider>
  );
};

export const getApolloClient = (
  ctx?: ApolloClientContext,
  initialState?: NormalizedCacheObject
) => {
  const uri = `${process.env.NODE_ENV == 'development' ? 'http://' : 'https://'}${process.env.VERCEL_URL || 'localhost'}${process.env.PORT ? ':' + String(process.env.PORT) : ''}/api/graphql`
  console.log('uri', uri)
  // Just forward the cookie? 
  let cookie = ctx?.req.headers.cookie
  // const enhancedFetch = (request: RequestInfo, init?: RequestInit) => {
  //   return fetch(request, {
  //     ...init, 
  //     headers: {
  //       ...(init?.headers || {}),
  //       ...(cookie ? {"Cookie": cookie} : {})
  //     },
  //     credentials: 'same-origin'
  //   }).then(res => res);
  // }

  const httpLink = createHttpLink({
    uri,
    fetch,
    // fetch: enhancedFetch,
  });
  const cache = new InMemoryCache().restore(initialState || {});
  return new ApolloClient({
    link: from([
			timeStartLink,
			logTimeLink,
			httpLink
		]),
    cache,
  });
};
