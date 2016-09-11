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
function querySearch(req, res) {
  debug("POST", req.params);

  console.log(req.body);
  var pouchname = req.params.pouchname;
  var queryString = req.body.value;
  if (queryString && typeof queryString.trim === "function") {
    queryString = queryString.trim();
    console.log("Trimming string " + queryString);
  }
  if (!queryString) {
    res.send("400", []);
    return;
  }
  var queryTokens = search.processQueryString(queryString);
  if (!queryTokens || queryTokens.length === 0) {
    res.send("400", []);
    return;
  }
  var elasticsearchTemplateString = search.addQueryTokens(queryTokens);

  var searchoptions = JSON.parse(JSON.stringify(config.searchOptions));
  searchoptions.path = "/" + pouchname + "/datums/_search";
  searchoptions.headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(elasticsearchTemplateString, "utf8")
  };

  makeJSONRequest(searchoptions, elasticsearchTemplateString, function(statusCode, results) {
    console.log(elasticsearchTemplateString);
    res.send(statusCode, results);
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

  makeJSONRequest(couchoptions, undefined, function(statusCode, result) {
    debug("requested training data", result);
    if (!result || result instanceof Error || !result.rows) {
      return next(result);
    }
    // TODO use this to train the serach engine, so far it might be doing it in the fielddbwebserver
    result.rows.map(function(row) {
      debug("indexing ", row);


    });

    res.send(result);
  });
}

router.post("/:pouchname/index", indexDatabase);
router.post("/:pouchname", querySearch);

module.exports.querySearch = querySearch;
module.exports.indexDatabase = indexDatabase;

module.exports.router = router;
