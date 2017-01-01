var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CODE = __dirname+'/sampleApp';
var React = require('react');
var ReactDOMServer = require('react-dom/server');

module.exports = {

  devtool: 'eval',

  entry: fs.readdirSync(CODE).reduce(function (entries, dir) {
    if (isDirectory(path.join(CODE, dir)))
      entries[dir] = path.join(CODE, 'routes.js');
    return entries;
  }, {}),

  output: {
    path: 'sampleApp/__build__',
    filename: 'routes.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader', 
        query: {
            presets:['es2015','react']
        } 
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]

};

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

