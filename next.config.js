// const apiHost = 'http://localhost:4000';

module.exports = {
//  async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: `${apiHost}/:path*`,
//       },
//     ]
//   },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules|src\/queries/,
      loader: 'graphql-tag/loader',
    });
    if (!isServer) {
      //config.resolve.fallback.fs = false;

    }
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
};
