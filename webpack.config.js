const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    raidboss: "./src/raidboss/index.ts",
    test: "./src/test.ts",
  },
  devtool: "inline-source-map",
  optimization: {
    minimize: false,
    chunkIds: "named",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".mts", ".ts", ".mjs", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
        },
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
    name: "cactbot-user",
  },
};
