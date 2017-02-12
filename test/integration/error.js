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
            reason: "no_db_file"
          },
          status: 500
        });

        done();
      });
  });

  it("should handle lack of permission", function(done) {
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
            reason: "You are not authorized to access this db."
          },
          status: 500
        });

        done();
      });
  });

  it("should handle elasticsearch offline", function(done) {
    supertest(api)
      .post("/search/nockedcorpus")
      .send({
        value: "something:else"
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body).to.deep.equal({
          message: "connect ECONNREFUSED 127.0.0.1:9200",
          error: {
            address: "127.0.0.1",
            code: "ECONNREFUSED",
            errno: "ECONNREFUSED",
            port: 9200,
            syscall: "connect"
          },
          status: 500
        });

        done();
      });
  });
});
