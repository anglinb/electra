const apiHost = 'http://localhost:4000';

module.exports = {
 async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiHost}/:path*`,
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules|src\/queries/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
};
