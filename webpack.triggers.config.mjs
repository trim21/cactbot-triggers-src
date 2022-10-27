import * as path from 'path';
import * as url from 'url';

import CopyPlugin from 'copy-webpack-plugin';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  mode: 'production',
  entry: {
    raidboss: './src/raidboss/index.ts',
  },
  devtool: 'inline-source-map',
  optimization: {
    minimize: true,
    chunkIds: 'named',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'raidboss'),
  },
  externals: {
    'cactbot/resources/util': 'Util',
    'cactbot/resources/netregexes': 'NetRegexes',
    'cactbot/resources/conditions': 'Conditions',
    'cactbot/resources/zone_id': 'ZoneId',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false,
              sourceMap: true,
            },
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { chrome: '103' } }], ['@babel/preset-typescript']],
            sourceMaps: 'inline',
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/raidboss.css' }],
    }),
  ],
  cache: {
    type: 'filesystem',
    name: 'cactbot-user',
  },
};
