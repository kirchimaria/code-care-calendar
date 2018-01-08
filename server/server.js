const path = require('path');
const fs = require('fs');
const express = require('express');
const config = require('../webpack.config.js');
const webpack = require('webpack');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const Promise = require("bluebird");
mongoose.Promise = Promise;

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');

let compiler = webpack(config);
let app = express();

mongoose.connect('mongodb://localhost/code');

app.use(bodyParse.urlencoded({
    extended: false,
}));
app.use(bodyParse.json({}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(webpackDevMiddleware(compiler, {'noInfo' : true ,
    publicPath: config.output.publicPath}))
app.use(webpackHotMiddleware(compiler));

app.set('view engine', 'html');
app.engine('html', function (path, options, callbacks) {
  fs.readFile(path, 'utf-8', callback);
});
app.use(express.static(path.join(__dirname, '../client')));


app.use('/api/user' , userRoutes);
app.use('/api/event', eventRoutes);

app.use('*', indexRoutes);


app.use(function (err, req, res, next) {
    console.log(err.status);
  res.status(err.status || 500);
});

module.exports = app;
