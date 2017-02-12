"use strict";

var config = require("config");
var debug = require("debug")("routes:train");
var express = require("express");
var url = require("url");

var makeJSONRequest = require("../lib/request");

var router = express.Router();

/**
 * Search a database
 * @param  {Request} req
 * @param  {Response} res
 */
function trainLexicon(req, res, next) {
  debug("POST", req.params);

  var pouchname = req.params.pouchname;
  var couchoptions = url.parse(config.corpus.url);
  couchoptions.path = "/" + pouchname + "/_design/lexicon/_view/lexiconNodes?group=true&limit=4";
  couchoptions.auth = "public:none"; // Not indexing non-public data couch_keys.username + ":" + couch_keys.password;

  makeJSONRequest(couchoptions, function(statusCode, result) {
    debug("requested training data", result);
    if (!result || result instanceof Error || !result.rows) {
      return next(result);
    }

    res.send(result);
  });
}

router.post("/lexicon/:pouchname", trainLexicon);

module.exports.trainLexicon = trainLexicon;

module.exports.router = router;
