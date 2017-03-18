"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");
var api = require("../../");

describe("/v1 error handling", function() {
  it("should handle route not found", function(done) {
    supertest(api)
      .post("/notaroute")
      .expect("Content-Type", "application/json; charset=utf-8")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body).to.deep.equal({
          message: "Not Found",
          error: {
            status: 404
          },
          status: 404
        });

        done();
      });
  });

  it("should handle corpus not found", function(done) {
    if (process.env.TRAVIS_PULL_REQUEST) {
      return this.skip();
    }

    supertest(api)
      .post("/train/lexicon/testing-notacorpus")
      .expect("Content-Type", "application/json; charset=utf-8")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body).to.deep.equal({
          message: "no_db_file",
          error: {
            error: "not_found",
            reason: "no_db_file",
            status: 404
          },
          status: 404
        });

        done();
      });
  });

  it("should handle lack of permission", function(done) {
    if (process.env.TRAVIS_PULL_REQUEST) {
      return this.skip();
    }

    supertest(api)
      .post("/train/lexicon/jenkins-firstcorpus")
      .expect("Content-Type", "application/json; charset=utf-8")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body).to.deep.equal({
          message: "You are not authorized to access this db.",
          error: {
            error: "unauthorized",
            reason: "You are not authorized to access this db.",
            status: 401
          },
          status: 401
        });

        done();
      });
  });

  it("should handle elasticsearch errors", function(done) {
    if (process.env.TRAVIS_PULL_REQUEST) {
      return this.skip();
    }
    supertest(api)
      .post("/search/notarealcorpus")
      .send({
        value: "something:else"
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body).to.deep.equal({
          message: "no such index",
          error: {
            error: {
              root_cause: [{
                type: "index_not_found_exception",
                reason: "no such index",
                "resource.type": "index_or_alias",
                "resource.id": "notarealcorpus",
                index_uuid: "_na_",
                index: "notarealcorpus"
              }],
              type: "index_not_found_exception",
              reason: "no such index",
              "resource.type": "index_or_alias",
              "resource.id": "notarealcorpus",
              index_uuid: "_na_",
              index: "notarealcorpus"
            },
            status: 404
          },
          status: 404
        });

        done();
      });
  });
});
