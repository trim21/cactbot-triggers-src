const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

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
    path: path.resolve(__dirname, 'dist', 'raidboss'),
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { chrome: '103' } }],
              ['@babel/preset-typescript'],
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
    new CopyPlugin({
      patterns: [{ from: './src/raidboss.css' }],
    }),
  ],
  cache: {
    type: 'filesystem',
    name: 'cactbot-user',
  },
};
