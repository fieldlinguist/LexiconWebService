"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");

describe("/v1", function() {
  describe("search", function() {
    it("should search a database", function(done) {
      this.timeout(20 * 1000);

      supertest(api)
        .post("/search/testinglexicon-kartuli")
        .send({
          value: "morphemes:shi"
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log(res.body);
          expect(res.status).to.equal(500);
          expect(res.body).to.deep.equal({
            code: "ECONNREFUSED",
            errno: "ECONNREFUSED",
            syscall: "connect",
            address: "127.0.0.1",
            port: 3195
          });

          done();
        });
    });
  });
});
