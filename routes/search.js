"use strict";

var debug = require("debug")("routes:search");
var express = require("express");
var config = require("config");
var search = require("../lib/search");
var makeJSONRequest = require("../lib/request");

var router = express.Router();

/**
 * Search a database
 * @param  {Request} req
 * @param  {Response} res
 */
function querySearch(req, res, next) {
  debug("POST", req.params);

  console.log(req.body);
  var pouchname = req.params.pouchname;
  var queryString = req.body.value;
  if (queryString && typeof queryString.trim === "function") {
    queryString = queryString.trim();
    console.log("Trimming string " + queryString);
  }
  if (!queryString) {
    res.status(400);
    res.json([]);
    return;
  }
  var queryTokens = search.processQueryString(queryString);
  if (!queryTokens || queryTokens.length === 0) {
    res.status(400);
    res.json([]);
    return;
  }
  var elasticsearchTemplateString = search.addQueryTokens(queryTokens);

  var searchoptions = JSON.parse(JSON.stringify(config.searchOptions));
  searchoptions.path = "/" + pouchname + "/datums/_search";
  searchoptions.headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(elasticsearchTemplateString, "utf8")
  };
  debug(elasticsearchTemplateString);

  makeJSONRequest(searchoptions, elasticsearchTemplateString, function(status, result) {
    debug("requested search result", result);
    if (status >= 400 || !result || result instanceof Error) {
      return next(result);
    }

    res.status(status);
    res.json(result);
  });
}

/**
 * Re-index a database
 * @param  {Request} req
 * @param  {Response} res
 */
function indexDatabase(req, res, next) {
  debug("POST", req.params);

  var pouchname = req.params.pouchname;
  var couchoptions = JSON.parse(JSON.stringify(config.corpusOptions));
  couchoptions.path = "/" + pouchname + "/_design/search/_view/searchable";
  couchoptions.auth = "public:none"; // Not indexing non-public data couch_keys.username + ":" + couch_keys.password;

  makeJSONRequest(couchoptions, undefined, function(status, result) {
    debug("requested training data", result);
    if (status >= 400 || !result || result instanceof Error || !result.rows) {
      return next(result);
    }
    // TODO use this to train the serach engine, so far it might be doing it in the fielddbwebserver
    result.rows.map(function(row) {
      debug("indexing ", row);


    });

    res.json(result);
  });
}

router.post("/:pouchname/index", indexDatabase);
router.post("/:pouchname", querySearch);

module.exports.querySearch = querySearch;
module.exports.indexDatabase = indexDatabase;

module.exports.router = router;
