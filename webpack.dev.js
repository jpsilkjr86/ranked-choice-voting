const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// merge module merges common with dev to separate environment configurations
module.exports = merge(common, {
	// strong source mapping for error debugging (telling us line
	// and src file rather than simply bundle.js)
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './public'
  }
});