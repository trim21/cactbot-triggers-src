const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  performance: {
    hints: false,
  },
  entry: { main: './src/raidboss/config/main.ts' },
  output: {
    path: path.resolve(__dirname, './dist/ui/'),
    filename: 'main.js',
  },
  mode: 'production',
  optimization: {
    minimize: false,
    chunkIds: 'named',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
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
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: 'chrome106',
              charset: 'utf8',
            },
          },
        ],
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
      template: './src/raidboss/config/index.html',
    }),
  ],
};
