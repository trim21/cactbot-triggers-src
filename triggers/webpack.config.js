const path = require('path');
const _ = require('esbuild-loader');

module.exports = {
  mode: 'production',
  entry: {
    raidboss: './src/raidboss/index.ts',
  },
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
    chunkIds: 'named',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.mts', '.ts', '.mjs', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.m?[jt]s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'js',
              target: 'chrome103',
              charset: 'utf8',
            },
          },
          {
            loader: 'ts-loader',
          }
        ],
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    name: 'cactbot-user',
  },
};
