const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: "babel-loader" },
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
  ],
};
