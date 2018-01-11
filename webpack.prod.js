const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
// merge module merges common with production to separate environment configurations
module.exports = merge(common, {
	// use this source-map instead of eval for production (more condensed)
	devtool: 'source-map',
  plugins: [
  	// for minification of bundle.js
    new UglifyJSPlugin({
    	sourceMap: true
    }),
    // supposed to minify bundle.js output even further
    // see: https://webpack.js.org/guides/production/#specify-the-environment
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
});