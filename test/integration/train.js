"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");

describe("/v1", function() {
  describe("train", function() {
    it("should train a lexicon", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/train/lexicon/testinglexicon-kartuli")
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
            "translation",
            "validationStatus",
            "enteredByUser",
            "context",
            "goal",
            "consultants",
            "dialect",
            "language",
            "dateElicited",
            "user",
            "dateSEntered",
            "utterance",
            "morphemes",
            "gloss"
          ]);

          expect(res.body.rows[0].id).to.equal(res.body.rows[0].value);
          done();
        });
    });
  });
});
