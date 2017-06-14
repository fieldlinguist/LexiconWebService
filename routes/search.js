/* globals Promise */
"use strict";

var config = require("config");
var debug = require("debug")("routes:search");
var express = require("express");
var request = require("request");
var url = require("url");

var search = require("../lib/search");

var router = express.Router();

/**
 * Search a database
 * @param  {Request} req
 * @param  {Response} res
 */
function querySearch(req, res, next) {
  debug("querySearch", req.params);

  debug("body", req.body);
  var dbname = req.params.dbname;
  var queryString = req.body.query;
  if (queryString && typeof queryString.trim === "function") {
    queryString = queryString.trim();
    debug("Trimming string " + queryString);
  }

  var queryTokens = search.processQueryString(queryString);
  var elasticsearchTemplateString = search.addQueryTokens(queryTokens || []);
  debug(elasticsearchTemplateString);

  var searchOptions = url.parse(config.search.url);
  searchOptions.pathname = "/" + dbname + "/datum/_search";

  debug("searchOptions ", searchOptions, elasticsearchTemplateString);
  debug("elasticsearchTemplateString ", elasticsearchTemplateString);
  request({
    body: elasticsearchTemplateString,
    json: true,
    method: "GET",
    uri: url.format(searchOptions)
  }, function(err, response, body) {
    debug("requested search result", url.format(searchOptions), err, body);
    if (err) {
      return next(err);
    }
    if (response.statusCode >= 400) {
      body.status = response.statusCode;
      return next(body);
    }

    res.status(response.statusCode);
    body.original = elasticsearchTemplateString;
    res.json(body);
  });
}

/*
 * Can set the analyzer on the index
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html
 */
function declareAnalyzer(req, res, next) {
  var dbname = req.params.dbname;
  var languageName = req.query.languageName;
  var maxTokenLength = req.query.maxTokenLength;
  request({
    body: {
      "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
          "analyzer": {
            "my_unicode_analyzer": {
              "type": "standard",
              "max_token_length": maxTokenLength || 5,
              "stopwords": languageName || "_english_"
            }
          }
        }
      }
    },
    json: true,
    method: "PUT",
    uri: url.format(config.search.url + "/" + dbname + "/datum")
  }, function(err, response, elasticSearchResult) {
    debug("Set the analalyzer");
    next(elasticSearchResult);
  });
}

/**
 * Re-index a database
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {Function} next
 */
function indexDatabaseChunk(req, res, next) {
  return new Promise(function(resolve) {
    debug("indexDatabaseChunk", req.params);
    var dbname = req.params.dbname;

    debug("Config", config, process.env);
    var couchDBOptions = url.parse(config.corpus.url + "/" + dbname + "/_design/search/_view/searchable");
    couchDBOptions.query = {
      skip: req.query.skip,
      limit: req.query.limit
    };

    debug("GET ", couchDBOptions);
    request({
      json: true,
      method: "GET",
      uri: url.format(couchDBOptions)
    }, function(err, response, couchDBResult) {
      debug("requested training data", couchDBResult);
      if (err) {
        return next(err);
      }
      if (response.statusCode >= 400) {
        if (couchDBResult.reason === "missing") {
          couchDBResult.reason = "Missing search map reduce";
        }
        couchDBResult.status = response.statusCode;
        return next(couchDBResult);
      }
      // create bulk requests
      var data = [];
      couchDBResult.rows.map(function(row) {
        var searchable = row.key;
        data.push({
          "index": {
            "_id": row.id,
            "_type": "datum",
            "_index": dbname
          }
        });

        data.push(searchable);
      });
      // convert into 1 request per line (non-json)
      data = data.map(JSON.stringify).join("\n") + "\n";
      debug("(re-)indexing with \n\n", data);
      debug("\n\n");

      request({
        body: data,
        // json: true,
        method: "POST",
        uri: url.format(config.search.url + "/" + dbname + "/datum/_bulk")
      }, function(err, response, elasticSearchResult) {
        debug("index search elasticSearchResult", err, elasticSearchResult);
        if (err) {
          return next(err);
        }
        try {
          elasticSearchResult = JSON.parse(elasticSearchResult);
        } catch (parseError) {
          return next(parseError);
        }
        if (response.statusCode >= 400) {
          elasticSearchResult.status = response.statusCode;
          return next(elasticSearchResult);
        }

        var newOffset = req.query.skip + req.query.limit;
        debug("newOffset", newOffset);
        if (!couchDBResult.total_rows || couchDBResult.total_rows <= newOffset) {
          return resolve({
            statusCode: response.statusCode,
            couchDBResult: couchDBResult,
            elasticSearchResult: elasticSearchResult
          });
        }
        req.query.skip = newOffset;
        return indexDatabaseChunk(req, res, next).then(resolve);
      });
    });
  });
}

function indexDatabase(req, res, next) {
  req.query.skip = req.query.offset || 0;
  var limit = req.query.limit || config.search.DEFAULT_MAX_INDEX_LIMIT;
  req.query.limit = Math.min(limit, config.search.DEFAULT_MAX_INDEX_LIMIT);

  return indexDatabaseChunk(req, res, next)
    .then(function(result) {
      res.status(result.statusCode);
      res.json({
        couchDBResult: result.couchDBResult,
        elasticSearchResult: result.elasticSearchResult
      });
    }).catch(next);
}

router.post("/:dbname/index", indexDatabase);
router.post("/:dbname", querySearch);
router.get("/:dbname", querySearch);

module.exports.querySearch = querySearch;
module.exports.indexDatabase = indexDatabase;
module.exports.declareAnalyzer = declareAnalyzer;

module.exports.router = router;
