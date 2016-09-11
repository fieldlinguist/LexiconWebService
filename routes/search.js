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
  var dbname = req.params.dbname;
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

  var searchOptions = JSON.parse(JSON.stringify(config.searchOptions));
  searchOptions.data = elasticsearchTemplateString;
  searchOptions.path = "/" + dbname + "/data/_search";

  debug(elasticsearchTemplateString);

  makeJSONRequest(searchOptions, function(status, result) {
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
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {Function} next
 */
function indexDatabase(req, res, next) {
  debug("POST", req.params);

  var dbname = req.params.dbname;
  var couchDBOptions = JSON.parse(JSON.stringify(config.corpusOptions));
  couchDBOptions.path = "/" + dbname + "/_design/search/_view/searchable?limit=4";
  couchDBOptions.auth = "public:none"; // Not indexing non-public data couch_keys.username + ":" + couch_keys.password;

  makeJSONRequest(couchDBOptions, function(status, couchDBResult) {
    debug("requested training data", couchDBResult);
    if (status >= 400 || !couchDBResult || couchDBResult instanceof Error || !couchDBResult.rows) {
      return next(couchDBResult);
    }

    // add id to each searchable
    var data = [];

    couchDBResult.rows.map(function(row) {
      var searchable = row.key;
      data.push({
        "create": {
          "_id": row.id,
          // "_type": "type1",
          "_index": dbname + "/datum"
        }
      });
      data.push(searchable);
    });

    // data.unshift({ "index": { "_type": "blog" }});
    // convert into 1 searchable per line
    data = data.map(JSON.stringify).join("\n") + "\n";
    debug("re-indexing ", data); // TODO what data?

    data = `{ "index" : { "_index" : "${dbname}", "_type" : "type1", "_id" : "${couchDBResult.rows[0].id}" } }
{ "field1" : "value1" }
`;
    debug("overrode the data", data);


    var searchOptions = JSON.parse(JSON.stringify(config.searchOptions));
    searchOptions.method = "POST";
    searchOptions.data = data;
    // searchOptions.headers = {
    //   "Content-Type": "application/json",
    //   "Content-Length": Buffer.byteLength(data, "utf8")
    // };
    // searchOptions.headers = {
    //   "Content-Type": "application/x-www-form-urlencoded",
    //   "Content-Length": 93
    // };
    searchOptions.path = "/_bulk"; // TODO what url?
    // searchOptions.path = "/" + dbname + "/datum/_bulk";

    makeJSONRequest(searchOptions, function(status, elasticSearchResult) {
      debug("index search elasticSearchResult", elasticSearchResult);
      if (status >= 400 || !elasticSearchResult || elasticSearchResult instanceof Error) {
        return next(elasticSearchResult);
      }

      res.status(status);
      res.json({
        couchDBResult: couchDBResult,
        elasticSearchResult: elasticSearchResult
      });
    });
  });
}

router.post("/:dbname/index", indexDatabase);
router.post("/:dbname", querySearch);

module.exports.querySearch = querySearch;
module.exports.indexDatabase = indexDatabase;

module.exports.router = router;
