'use strict';

var debug = require('debug')('routes:search');
var express = require('express');
var config = require('config');
var search = require('../lib/search');

var router = express.Router();

/**
 * Search a database
 * @param  {Request} req
 * @param  {Response} res
 * @param  {Function} next
 */
function querySearch(req, res, next) {
  debug('POST', req.params);

  console.log(req.body);
  var pouchname = req.params.pouchname;
  var queryString = req.body.value;
  if (queryString && typeof queryString.trim === 'function') {
    queryString = queryString.trim();
    console.log('Trimming string ' + queryString);
  }
  if (!queryString) {
    res.send('400', []);
    return;
  }
  var queryTokens = search.processQueryString(queryString);
  if (!queryTokens || queryTokens.length === 0) {
    res.send('400', []);
    return;
  }
  var elasticsearchTemplateString = search.addQueryTokens(queryTokens);

  var searchoptions = JSON.parse(JSON.stringify(config.searchOptions));
  searchoptions.path = '/' + pouchname + '/datums/_search';
  searchoptions.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(elasticsearchTemplateString, 'utf8')
  };

  makeJSONRequest(searchoptions, elasticsearchTemplateString, function(statusCode, results) {
    console.log(elasticsearchTemplateString);
    res.send(statusCode, results);
  });
}

router.post('/:pouchname', querySearch);

module.exports.querySearch = querySearch;

module.exports.router = router;
