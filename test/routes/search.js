"use strict";

var expect = require("chai").expect;

var search = require("./../../routes/search");

describe("search routes", function() {
  it("should load", function() {
    expect(search).to.be.a("object");
    expect(search.router).to.be.a("function");
    expect(search.querySearch).to.be.a("function");
  });
});
