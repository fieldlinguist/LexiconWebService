"use strict";

var debug = require("debug")("middleware:error");

/*jshint -W098 */
function errors(err, req, res, next) {
  /*jshint +W098 */
  var data;

  debug("in the error handler " + process.env.NODE_ENV, err, err.stack);
  console.log(err);

  if (["development", "test", "local"].indexOf(process.env.NODE_ENV) > -1) {
    // expose stack traces
    data = {
      message: err.message,
      error: err
    };
  } else {
    // production error handler
    data = {
      message: err.message,
      error: {}
    };
  }

  data.status = err.status || err.statusCode || 500;

  // support errors from elastic search
  if (!data.message && err.error) {
    data.message = err.error.reason;
  }

  // support errors from couchdb
  if (!data.message && err.reason) {
    data.message = err.reason;
  }

  res.status(data.status);
  res.json(data);
}

module.exports = errors;
