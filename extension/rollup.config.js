import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import * as fs from 'fs';

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD', { encoding: 'utf-8' })
  .trim();

const terserInstance = terser({
  mangle: {
//     // captureExceptions and captureMessage are public API methods and they don't need to be listed here
//     // as mangler doesn't touch user-facing thing, however sentryWrapped is not, and it would be mangled into a minified version.
//     // We need those full names to correctly detect our internal frames for stripping.
//     // I listed all of them here just for the clarity sake, as they are all used in the frames manipulation process.
    reserved: ['__STAFFBAR__'],
//     properties: {
//       regex: /^_[^_]/,
//       // This exclusion prevents most of the occurrences of the bug linked below:
//       // https://github.com/getsentry/sentry-javascript/issues/2622
//       // The bug is caused by multiple SDK instances, where one is minified and one is using non-mangled code.
//       // Unfortunatelly we cannot fix it reliably (thus `typeof` check in the `InboundFilters` code),
//       // as we cannot force people using multiple instances in their apps to sync SDK versions.
//       reserved: ['_mergeOptions'],
//     },
  },
});

const paths = {
  '@staffbar/rpc-iframe': ['../packages/rpc-iframe/src'],
  '@staffbar/rpc': ['../packages/rpc/src'],
  '@staffbar/inject-core': ['../packages/inject-core/src'],
  '@staffbar/inject-full': ['../packages/inject-full/src'],
  '@staffbar/inject-entrypoint': ['../packages/inject-entrypoint/src']
};

const defaultPlugins = [
  typescript({
    tsconfig: 'tsconfig.build.json',
    tsconfigOverride: {
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        module: 'ES2015',
        paths,
      },
    },
    include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
  }),
  resolve({
    mainFields: ['module'],
    browser: true,
  }),
  replace({
    preventAssignment: true,
    // nanoid asked for this...
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  commonjs(),
];

const configurations = [
  'activate-staffbar',
  'background',
  'entrypoint',
  'complete',
  'content-script',
].map((output) => {
  var plugins = defaultPlugins
  if (output === 'content-script') {
    // We want our content script to contain the entrypoint.js
    // loaded into the script src
    plugins = [
      ...defaultPlugins,
      // replace({
      //   'process.env.ENTRYPOINT_JS': `\`${fs.readFileSync('build/entrypoint.min.js')}\``,
      // })
    ]
  }

  let bundleConfigPlugins = plugins
  if (output !== 'entrypoint') {
    bundleConfigPlugins = [
      ...plugins,
      license({
        sourcemap: false,
        banner: `/*! @staffbar/${output} <%= pkg.version %> (${commitHash}) | https://github.com/staffbar/staffbar */`,
      }),
    ]
  }

  const bundleConfig = {
    input: `src/${output}.ts`,
    output: {
      format: 'iife',
      name: ( output === 'entrypoint' ? 'StaffBar' : 'StaffBarComplete' ),
      sourcemap: false,
      strict: false,
    },
    context: 'window',
    plugins: bundleConfigPlugins
  };

  return [
    // ES5 Browser Bundle
    {
      ...bundleConfig,
      output: {
        ...bundleConfig.output,
        file: `build/${output}.js`,
      },
    },
    {
      ...bundleConfig,
      output: {
        ...bundleConfig.output,
        file: `build/${output}.min.js`,
      },
      // Uglify has to be at the end of compilation, BUT before the license banner
      plugins: bundleConfig.plugins
        .slice(0, -1)
        .concat(terserInstance)
        .concat(bundleConfig.plugins.slice(-1)),
    },
    // // ------------------
    // // ES6 Browser Bundle
    // {
    //   ...bundleConfig,
    //   output: {
    //     ...bundleConfig.output,
    //     file: `build/${output}.es6.js`,
    //   },
    //   plugins: [
    //     typescript({
    //       tsconfig: 'tsconfig.build.json',
    //       tsconfigOverride: {
    //         compilerOptions: {
    //           declaration: false,
    //           declarationMap: false,
    //           module: 'ES2015',
    //           paths,
    //           target: 'es6',
    //         },
    //       },
    //       include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
    //     }),
    //     ...plugins.slice(1).concat(bundleConfig.plugins.slice(-1)),
    //   ],
    // },
    // {
    //   ...bundleConfig,
    //   output: {
    //     ...bundleConfig.output,
    //     file: `build/${output}.es6.min.js`,
    //   },
    //   plugins: [
    //     typescript({
    //       tsconfig: 'tsconfig.build.json',
    //       tsconfigOverride: {
    //         compilerOptions: {
    //           declaration: false,
    //           declarationMap: false,
    //           module: 'ES2015',
    //           paths,
    //           target: 'es6',
    //         },
    //       },
    //       include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)'],
    //     }),
    //     ...plugins
    //       .slice(1)
    //       .slice(0, -1)
    //       .concat(terserInstance)
    //       .concat(bundleConfig.plugins.slice(-1)),
    //   ],
    // },
    // ------------------
  ];

}).reduce((prev, next) => prev.concat(next), [])

export default configurations;
