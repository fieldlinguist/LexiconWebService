"use strict";
var expect = require("chai").expect;

var api = require("../../");

describe("/v1", function() {
  it("should load the service", function(){
    expect(api).to.be.an("function");
  });
});
