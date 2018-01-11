// ================ Dependencies ================
const express = require('express'),
	bodyParser = require('body-parser'),
  logger = require('morgan'),
  path = require('path');

// sets up express app
const app = express();
const port = process.env.PORT || 3000;

// ============ Webpack Middleware Configurations (Development Only - "npm run dev") ============
// first checks to make sure NODE_ENV is in development mode
if (process.env.NODE_ENV === 'development') {
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
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}

// ================ Express Configuration ================
// Configures Express and body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// serves public directory as static, enabling html pages to link with their assets
app.use(express.static('public'));

// ================ Connection Establishment ================
app.listen(port, () => {
	console.log('App listening on port ' + port);
  // sets up api-routes
  require('./controllers/api-routes.js')(app);
  // catch-all get route to ensure SPA works correctly (with react-router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });
});