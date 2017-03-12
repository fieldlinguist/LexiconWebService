"use strict";

var config = require("config");
var debug = require("debug")("routes:train");
var express = require("express");
var request = require("request");
var url = require("url");

var router = express.Router();

/**
 * Search a database
 * @param  {Request} req
 * @param  {Response} res
 */
function trainLexicon(req, res, next) {
  debug("trainLexicon", req.params);

  var pouchname = req.params.pouchname;
  var couchDBOptions = url.parse(config.corpus.url + "/" + pouchname + "/_design/lexicon/_view/lexiconNodes");
  couchDBOptions.query = {
    group: true,
    limit: 4
  };

  request({
    uri: url.format(couchDBOptions),
    method: "GET",
    json: true
  }, function(err, response, body) {
    debug("requested training data", err, response.statusCode, body);
    if (err) {
      return next(err);
    }
    if (response.statusCode >= 400) {
      body.status = response.statusCode;
      return next(body);
    }

    res.json(body);
  });
}

router.post("/lexicon/:pouchname", trainLexicon);

module.exports.trainLexicon = trainLexicon;

module.exports.router = router;
