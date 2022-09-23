const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    raidboss: "./src/raidboss/index.ts",
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
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          // options: {
          //   parseMap: true,
          //   sourceMaps: true,
          //   inputSourceMap: true,
          // },
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
