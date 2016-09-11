"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");

describe.only("/v1", function() {
  describe("search", function() {
    it("should search a database", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/search/testinglexicon-kartuli")
        .send({
          value: "utterance:ar"
        })
        .expect("Content-Type", "application/json; charset=utf-8")
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log(res.body);

          if (res.status === 401) {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({
              message: 'action [indices:data/read/search] requires authentication',
              error: {},
              status: 401
            });
          } else if (res.status === 500) {
            expect(res.status).to.equal(500);
            if (res.body.message.indexOf('ECONNREFUSED') > -1) {
              expect(res.body).to.deep.equal({
                message: 'connect ECONNREFUSED 127.0.0.1:3195',
                error: {},
                status: 500
              });
            } else {
              expect(res.body).to.deep.equal({
                message: 'Unknown cluster.',
                error: {},
                status: 500
              });
            }
          }

          if (res.status === 201) {
            expect(res.status).to.equal(201);
          } else {
            expect(res.status).to.equal(200);
          }


          expect(res.body).to.have.keys([
            "took",
            "timed_out",
            "_shards",
            "hits"
          ]);

          expect(res.body.hits).to.have.keys([
            "total",
            "max_score",
            "hits"
          ]);

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

          if (res.status >= 400) {
            throw res.body;
          }

          expect(res.body.couchDBResult).to.have.keys([
            "offset",
            "rows",
            "total_rows"
          ]);

          expect(res.body.couchDBResult.rows[0]).to.have.keys([
            "id",
            "key",
            "value"
          ]);

          expect(res.body.couchDBResult.rows[0].key).to.have.keys([
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

          expect(res.body.couchDBResult.rows[0].id).to.equal(res.body.couchDBResult.rows[0].value);
          done();
        });
    });

    it("should re-index a media heavy database", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/search/testinglexicon-kartuli/index")
        .expect("Content-Type", "application/json; charset=utf-8")
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          if (res.status >= 400) {
            throw res.body;
          }

          expect(res.body.couchDBResult).to.have.keys([
            "offset",
            "rows",
            "total_rows"
          ]);

          expect(res.body.couchDBResult.rows[0]).to.have.keys([
            "id",
            "key",
            "value"
          ]);

          expect(res.body.couchDBResult.rows[3].key).to.have.keys([
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

          expect(res.body.couchDBResult.rows[0].id).to.equal(res.body.couchDBResult.rows[0].value);

          expect(res.body.elasticSearchResult).to.deep.equal({
            _index: 'testinglexicon-kartuli',
            _type: 'datum',
            _id: res.body.elasticSearchResult._id,
            _version: res.body.elasticSearchResult._version,
            _shards: {
              total: 2,
              successful: res.body.elasticSearchResult._shards.successful,
              failed: 0
            },
            created: res.body.elasticSearchResult.created
          });

          done();
        });
    });
  })
});
