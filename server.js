// ================ Dependencies ================
const express = require('express'),
	bodyParser = require('body-parser'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  path = require('path');

// sets up express app
const app = express();
const port = process.env.PORT || 3000;

// ============ Webpack Middleware Configurations (Development Only - "npm run dev") ============
if (process.env.NODE_ENV === 'development') {
  require('./webpack-dev-middleware')(app);
}

// ================ Express Configuration ================
const webRouter = require('./routes/web'),
  apiRouter = require('./routes/api');

// Configures Express and body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.text());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// serves public directory as static, enabling html pages to link with their assets
app.use(express.static('public'));

app.use('/api', apiRouter);
app.use('/', webRouter);

// ================ Connection Establishment ================
app.listen(port, () => {
	console.log('App listening on port ' + port);
});