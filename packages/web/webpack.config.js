const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefresh = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: "babel-loader" },
      },
      {
        test: /\.css/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true } },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public/index.html", to: "" }],
    }),
    new ReactRefresh(),
  ],
};
