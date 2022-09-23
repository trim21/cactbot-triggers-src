const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    raidboss: "./src/raidboss/index.ts",
  },
  optimization: {
    minimize: false,
    chunkIds: "named"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: "98",
                  },
                },
              ],
              ["@babel/preset-typescript"],
            ],
          },
        },
        resolve: {
          fullySpecified: false
        }
      }
    ],
  },
  plugins: [
    new webpack.CleanPlugin(),
  ],
};
