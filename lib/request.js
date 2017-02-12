"use strict";

var debug = require("debug")("lib:jsonrequest");
var http = require("http");
var https = require("https");

module.exports = function makeJSONRequest(options, onResult) {
  var httpOrHttps = http;
  var data = options.data;
  if (options.href.indexOf("https://") === 0) {
    httpOrHttps = https;
    debug("Using https ", options.href);
  }
  delete options.data;

  debug("Requesting ", options);
  var req = httpOrHttps.request(options, function(res) {
    var output = "";
    // res.setEncoding("utf8");

    res.on("data", function(chunk) {
      output += chunk;
    });

    res.on("end", function() {
      try {
        var obj = JSON.parse(output);
        onResult(res.statusCode, obj);
      } catch (err) {
        debug("Server replied with non-json", output);
        onResult(res.statusCode, new Error("Unexpected reply for " + options.path));
      }
    });
  });
  // req.setHeader("Content-type", "application/json; charset=utf-8");

  req.on("error", function(err) {
    console.log("Error searching for " + JSON.stringify(data));
    console.log(options);
    console.log(err.stack);
    onResult(500, err);
  });

  if (data) {
    debug("data is a object?", data.constructor !== String);
    if (data.constructor !== String) {
      debug("stringifying data", data);
      data = JSON.stringify(data);
    }
    debug("sending data", data);
    req.write(data, "utf8");
    req.end();
  } else {
    req.end();
  }
};
