var webpack = require('webpack');
var pkg = require('./package');
var banner = pkg.name + ' v' + pkg.version;

module.exports = {
  entry: './src/',
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'jshint-loader'
    }],
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  jshint: {
    esversion: 6
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  output: {
    library: 'SvgText',
    libraryTarget: 'umd',
    filename: 'svg-text.js',
    path: './dist',
  }
};
