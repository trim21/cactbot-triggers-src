import * as path from 'path';
import * as url from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  performance: {
    hints: false,
  },
  entry: './src/config/main.ts',
  output: {
    path: path.resolve(__dirname, './dist/ui/'),
    filename: 'main.js',
  },
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimize: true,
    chunkIds: 'named',
  },
  experiments: { topLevelAwait: true },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(mjs|js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { chrome: '103' } }],
              ['@babel/preset-typescript', { allExtensions: true }],
            ],
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      minify: false,
      chunks: ['main'],
      filename: './config.html',
      template: './src/config/index.html',
    }),
  ],
};
