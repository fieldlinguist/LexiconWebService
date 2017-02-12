"use strict";

var debug = require("debug")("middleware:error");

/*jshint -W098 */
function errors(err, req, res, next) {
  /*jshint +W098 */
  var data;

  debug("in the error handler", err, err.stack);

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
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

  if (data.status === 500 && data.message === "Failed to obtain access token") {
    data.status = 403;
  }

  // support errors from elastic search
  if (!data.message && err.error) {
    data.message = err.error.reason;
  }

  // support errors from couchdb
  if (!data.message && err.reason) {
    data.message = err.reason;
  }

  res.status(data.status);
  if (typeof res.json === "function") {
    res.json(data);
  } else if (typeof req.json === "function") {
    req.json(data);
  }
}

module.exports = errors;