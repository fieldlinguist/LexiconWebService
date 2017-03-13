'use strict';

var bodyParser = require('body-parser');
var cors = require("cors");
var debug = require('debug')('service');
var express = require('express');
var favicon = require("serve-favicon");
var morgan = require('morgan');

var errorsMiddleware = require('./middleware/error');
var inuktitutRoutes = require('./routes/inuktitut').router;
var searchRoutes = require('./routes/search').router;
var trainRoutes = require('./routes/train').router;

var service = express();

/**
 * Config
 */
service.use(morgan('combined'));

/**
 * Body parsers
 */
service.use(bodyParser.json());
service.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * Middleware
 */
service.use(cors());

/**
 * Routes
 */
service.use(favicon(__dirname + "/public/favicon.ico"));
service.use(express.static(__dirname + '/bower_components/fielddb-glosser/samples/vanilla'));
service.use(express.static(__dirname + '/bower_components/fielddb-glosser'));
// TODO switch to lexicon browser
// service.use(express.static(__dirname + '/bower_components/fielddb-glosser/samples/vanilla'));
service.use('/search', searchRoutes);
service.use('/train', trainRoutes);
service.use('/', inuktitutRoutes);

/**
 * Not found
 */
service.use(function(req, res, next) {
  debug(req.url + ' was not found');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Attach error handler
 */
service.use(errorsMiddleware);

module.exports = service;
