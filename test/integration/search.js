"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");
var fixtures = {
  search: {
    index: {
      kartuli: require("../fixtures/search/kartuli/index"),
      quechua: require("../fixtures/search/quechua/index")
    },
    properties: {
      kartuli: require("../fixtures/search/kartuli/properties")
    },
    query: {
      kartuli: require("../fixtures/search/kartuli/utterance:ar")
    }
  },
  database: {
    kartuli: require("../fixtures/database/kartuli/searchable"),
    quechua: require("../fixtures/database/quechua/searchable")
  }
};

// could take 5 or 6 ms
delete fixtures.search.index.kartuli.took;
delete fixtures.search.query.kartuli.took;

fixtures.search.index.kartuli.items.map(function(item) {
  delete item.index._version; // version will increase on each request
  delete item.index.status; // status might be 201 created or 200 updated
});


describe("/v1", function() {
  it("should use fixtures", function() {
    expect(fixtures.search).to.be.an("object");
    expect(fixtures.search.index).to.be.an("object");
    expect(fixtures.search.index.kartuli).to.be.an("object");
    expect(fixtures.search.index.quechua).to.be.an("object");

    expect(fixtures.search.index.kartuli.items).to.be.an("array");
    expect(fixtures.search.index.quechua.items).to.be.an("array");

    expect(fixtures.search.query.kartuli).to.be.an("object");
    expect(fixtures.search.query.kartuli.hits).to.be.an("object");

    expect(fixtures.database).to.be.an("object");
    expect(fixtures.database.kartuli).to.be.an("object");
    expect(fixtures.database.quechua).to.be.an("object");

    expect(fixtures.database.kartuli.rows).to.be.an("array");
    expect(fixtures.database.quechua.rows).to.be.an("array");
  });

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
              message: "action [indices:data/read/search] requires authentication",
              error: {},
              status: 401
            });
          } else if (res.status === 500) {
            expect(res.status).to.equal(500);
            if (res.body.message.indexOf("ECONNREFUSED") > -1) {
              expect(res.body).to.deep.equal({
                message: "connect ECONNREFUSED 127.0.0.1:9200",
                error: {},
                status: 500
              });
            } else {
              expect(res.body).to.deep.equal({
                message: "Unknown cluster.",
                error: {},
                status: 500
              });
            }
          }

          delete res.body.took;

          console.log(JSON.stringify(res.body, null, 2));
          expect(res.body).to.deep.equal(fixtures.search.query.kartuli);

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

          console.log(JSON.stringify(res.body.couchDBResult, null, 2));
          expect(res.body.couchDBResult).to.deep.equal(fixtures.database.quechua);

          // could take 5 or 6 ms
          delete res.body.elasticSearchResult.took;

          res.body.elasticSearchResult.items.map(function(item) {
            delete item.index._version; // version will increase on each request
            delete item.index.status; // status might be 201 created or 200 updated
          });
          console.log(JSON.stringify(res.body.elasticSearchResult, null, 2));
          expect(res.body.elasticSearchResult).to.deep.equal(fixtures.search.index.quechua);

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

          console.log(JSON.stringify(res.body.couchDBResult, null, 2));
          expect(res.body.couchDBResult).to.deep.equal(fixtures.database.kartuli);

          // could take 5 or 6 ms
          delete res.body.elasticSearchResult.took;

          res.body.elasticSearchResult.items.map(function(item) {
            delete item.index._version; // version will increase on each request
            delete item.index.status; // status might be 201 created or 200 updated
          });
          console.log(JSON.stringify(res.body.elasticSearchResult, null, 2));
          expect(res.body.elasticSearchResult).to.deep.equal(fixtures.search.index.kartuli);

          // look at the index properties
          supertest("http://localhost:9200")
            .get("/testinglexicon-kartuli")
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              console.log(JSON.stringify(res.body, null, 2));
              expect(res.body).to.deep.equal(fixtures.search.properties.kartuli);

              done();
            });
        });
    });
  });
});
