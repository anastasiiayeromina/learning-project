const { DuplicatesPlugin } = require('inspectpack/plugin');
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  // These modules doesn't support IE11:
  'logform',
  'winston-transport',
  'async',
  'is-stream',
]);

module.exports = withPlugins([
  [withTM, {}]
], {
  webpack: (config, {isServer}) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // const updatedAliases = {
    //   ...config.resolve.alias,
    //   'readable-stream': path.join(__dirname, './node_modules/readable-stream'),
    //   inherits: path.join(__dirname, './node_modules/inherits'),
    //   'safe-buffer': path.join(__dirname, './node_modules/safe-buffer'),
    // };

    // config.resolve.alias = {
    //   ...updatedAliases,
    // };

    // if (isProduction) {
    //   config.plugins.push(
    //     new DuplicatesPlugin({
    //       verbose: true,
    //       emitErrors: true,
    //     })
    //   )
    // }

    if (!isServer) {
      return {
        ...config,
        node: {
          fs: 'empty',
        }
      }
    }

    return config;
  }
})