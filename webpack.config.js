const Path = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const common = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [require("@babel/plugin-proposal-object-rest-spread")]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      "index.d.ts",
      "package.json",
      "README.md",
      "CHANGELOG.md",
      "LICENSE.md"
    ]),
    new UglifyJsPlugin({
      sourceMap: false,
      uglifyOptions: {
        minimize: true,
        compress: true,
        output: {
          comments: false,
          beautify: false
        }
      }
    })
  ],
  devtool: "inline-source-map",
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  }
};

const frontend = {
  entry: {
    "colony.front": "./src/colonies/browser.colony.ts",
    "darkwasp.front": "./src/configs/browser.config.ts",
  },
  output: {
    path: Path.resolve(__dirname, "build"),
    filename: "frontend/[name].js",
    libraryTarget: "var",
    library: "darkwasp",
  },
  target: "web"
};

const backend = {
  entry: {
    "colony.back": "./src/colonies/node.colony.ts",
    "darkwasp.back": "./src/configs/node.config.ts",
    "helper.back": "./helpers/node.helper.js",
  },
  output: {
    path: Path.resolve(__dirname, "build"),
    filename: "backend/[name].js",
    libraryTarget: "commonjs2",
    library: "darkwasp"
  },
  externals: {
    child_process: "child_process",
    path: "path",
    http: "http",
    os: "os"
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  }
};

module.exports = [
  Object.assign(frontend, common),
  Object.assign(backend, common)
];
