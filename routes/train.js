"use strict";

var debug = require("debug")("routes:train");
var express = require("express");
var config = require("config");
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
  var couchoptions = JSON.parse(JSON.stringify(config.corpusOptions));
  couchoptions.path = "/" + pouchname + "/_design/deprecated/_view/get_datum_fields";
  couchoptions.auth = "public:none"; // Not indexing non-public data couch_keys.username + ":" + couch_keys.password;

  makeJSONRequest(couchoptions, undefined, function(statusCode, result) {
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
