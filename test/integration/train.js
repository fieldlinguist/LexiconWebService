'use strict';
/* globals Promise */

var expect = require('chai').expect;
var supertest = require('supertest');

var api = require('../../');

describe.only('/v1', function() {
  describe('lexicon', function() {
    it("should train a lexicon", function(done) {
      this.timeout(20 * 1000);

      supertest(api)
        .post("/train/lexicon/testinglexicon-kartuli")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
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
