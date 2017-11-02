const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
module.exports = {
  entry: "./src/javascript/main.js",
  output: {
    path: __dirname + "/build",
    filename: "[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css-loader")
      },
      {
        test: /\.png$/,
        include: [
          path.resolve(__dirname, "noto-emoji")
        ],
        loader: "file-loader?name=icons/[name].[ext]"
      }
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      title: "3D Modeling"
    }),
    new ExtractTextPlugin("[hash].css"),
    new UglifyJsPlugin({
      parallel: true
    })
  ]
};