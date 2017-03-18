"use strict";
var config = require("config");
var expect = require("chai").expect;
var supertest = require("supertest");
var fixtures = require("../fixtures/lexicon/train.js");
var api = require("../../");

describe("/v1", function() {
  describe("train", function() {
    before(function() {
      if (process.env.TRAVIS_PULL_REQUEST) {
        return this.skip();
      }
      expect(config.corpus.url).to.not.equal(undefined);
    });

    it("should train a lexicon", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/train/lexicon/testinglexicon-kartuli")
        .query({
          limit: 4
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          // Travis doesnt have a local lexicon
          if (!res.body.rows) {
            expect(res.status).to.equal(500);
            console.log(res.body);
            expect(res.body).to.deep.equal({
              message: "connect ECONNREFUSED 127.0.0.1:5984",
              error: {},
              status: 500
            });

            return done();
          }

          console.log(JSON.stringify(res.body, null, 2));
          expect(res.body).to.deep.equal(fixtures);
          done();
        });
    });
  });
});
