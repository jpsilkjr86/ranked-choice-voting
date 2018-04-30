const express = require('express'),
	bodyParser = require('body-parser'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  path = require('path');

const webRouter = require('./routes/web'),
  apiRouter = require('./routes/api');

const app = express();

if (process.env.NODE_ENV === 'development') {
  require('./webpack-dev-middleware')(app);
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.text());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('public'));

app.use('/api', apiRouter);
app.use('/', webRouter);

module.exports = app;