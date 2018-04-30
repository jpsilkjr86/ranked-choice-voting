// export is a function that takes app as an argument
module.exports = app => {
	console.log('NODE_ENV is in development mode.'
			+ '\nConfiguring webpack-dev-middleware and webpack-hot-middleware...');

	// dependendies for webpack middleware
	const webpack = require('webpack'),
			webpackDevMiddleware = require('webpack-dev-middleware'),
			webpackHotMiddleware = require('webpack-hot-middleware'),
			config = require('./webpack.dev.js');
	const compiler = webpack(config);

	// webpack-dev-middleware emits files compiled by webpack to a live server.
	// webpack-hot-middleware allows hot reload of webpack with express server (just refresh page).
	// more info about webpack-dev-middleware at:
	// https://webpack.js.org/guides/development/#using-webpack-dev-middleware
	// https://github.com/webpack/webpack-dev-middleware
	// for info on integrating hot-middleware and dev-middleware see section "Server" at:
	// https://ditrospecta.com/javascript/react/es6/webpack/heroku/2015/08/08/deploying-react-webpack-heroku.html

	// configures webpack middlewares in development mode
	app.use(webpackHotMiddleware(compiler));
	app.use(webpackDevMiddleware(compiler, {
			// noInfo: true,
			publicPath: config.output.publicPath
	}));
}

