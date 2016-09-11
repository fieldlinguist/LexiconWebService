"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");

describe("/v1", function() {
  describe("search", function() {
    it("should search a database", function(done) {
      this.timeout(10 * 1000);

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

  describe("indexing", function() {
    it("should re-index a metadata heavy database", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/search/testinglexicon-quechua/index")
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

          expect(res.body).to.have.keys([
            "offset",
            "rows",
            "total_rows"
          ]);

          expect(res.body.rows[0]).to.have.keys([
            "id",
            "key",
            "value"
          ]);

          expect(res.body.rows[0].key).to.have.keys([
            "judgement",
            "utterance",
            "morphemes",
            "gloss",
            "translation",
            "tags",
            "validationStatus",
            "goal",
            "consultants",
            "dialect",
            "comments",
            "dateElicited",
            "modifiedByUser",
            "notesFromOldDB"
          ]);

          expect(res.body.rows[0].id).to.equal(res.body.rows[0].value);
          done();
        });
    });

    it.only("should re-index a media heavy database", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/search/testinglexicon-kartuli/index")
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

          expect(res.body).to.have.keys([
            "offset",
            "rows",
            "total_rows"
          ]);

          expect(res.body.rows[0]).to.have.keys([
            "id",
            "key",
            "value"
          ]);

          expect(res.body.rows[3].key).to.have.keys([
            "orthography",
            "utterance",
            "morphemes",
            "gloss",
            "translation",
            "media",
            "tags",
            "validationStatus",
            "goal",
            "dateElicited",
            "enteredByUser",
            "modifiedByUser"
          ]);

          expect(res.body.rows[0].id).to.equal(res.body.rows[0].value);
          done();
        });
    });
  })
});
