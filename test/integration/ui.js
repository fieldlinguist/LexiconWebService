"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");

describe("User Interface", function() {
  it("should load the lexicon browser", function(done) {
    supertest(api)
      .get("/")
      .expect("Content-Type", "text/html; charset=UTF-8")
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.text).to.contain("Welcome to the Lexicon Browser");

        done();
      });
  });
});
