var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = 'odd.min.js';
} else {
  outputFile = 'odd.js';
}

var config = {
  entry: __dirname + '/oddjs/src/odd.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/oddjs/dist',
    filename: outputFile,
    library: "ODD",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve('./oddjs/src'),
    extensions: ['', '.js']
  },
  plugins: plugins
};

module.exports = config;
