const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  performance: {
    hints: false,
  },
  entry: './src/config/main.ts',
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
