"use strict";
var config = require("config");
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
  delete item.index._shards.successful; // successful will match the number of shards
});

fixtures.search.index.quechua.items.map(function(item) {
  delete item.index._version; // version will increase on each request
  delete item.index.status; // status might be 201 created or 200 updated
  delete item.index._shards.successful; // successful will match the number of shards
});

delete fixtures.search.properties.kartuli["testinglexicon-kartuli"].settings.index.creation_date;
delete fixtures.search.properties.kartuli["testinglexicon-kartuli"].settings.index.uuid;

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
            delete item.index._shards.successful; // successful will match the number of shards
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

          var elasticSearchResult = res.body.elasticSearchResult;
          // could take 5 or 6 ms
          delete elasticSearchResult.took;

          elasticSearchResult.items.map(function(item) {
            delete item.index._version; // version will increase on each request
            delete item.index.status; // status might be 201 created or 200 updated
            delete item.index._shards.successful; // successful will match the number of shards
          });

          // look at the index properties
          supertest(config.search.url)
            .get("/testinglexicon-kartuli")
            .end(function(err, res) {
              if (err) {
                return done(err);
              }

              console.log(JSON.stringify(res.body, null, 2));
              delete res.body["testinglexicon-kartuli"].settings.index.creation_date;
              delete res.body["testinglexicon-kartuli"].settings.index.uuid;
              if (res.body["testinglexicon-kartuli"].settings.index.numberOfReplicas) {
                res.body["testinglexicon-kartuli"].settings.index.number_of_replicas = res.body["testinglexicon-kartuli"].settings.index.numberOfReplicas;
                delete res.body["testinglexicon-kartuli"].settings.index.numberOfReplicas;
              }
              if (res.body["testinglexicon-kartuli"].settings.index.numberOfShards) {
                res.body["testinglexicon-kartuli"].settings.index.number_of_shards = res.body["testinglexicon-kartuli"].settings.index.numberOfShards;
                delete res.body["testinglexicon-kartuli"].settings.index.numberOfShards;
              }
              expect(res.body).to.deep.equal(fixtures.search.properties.kartuli);

              console.log(JSON.stringify(elasticSearchResult, null, 2));
              expect(elasticSearchResult).to.deep.equal(fixtures.search.index.kartuli);

              done();
            });
        });
    });
  });

  describe("search", function() {
    it.only("should search a database", function(done) {
      this.timeout(10 * 1000);

      supertest(api)
        .post("/search/testinglexicon-kartuli")
        .send({
          // value: "orthography:არ OR translation:not"
          value: "orthography:არ"
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

          console.log(JSON.stringify(res.body, null, 2));
          expect(res.body.hits.total).to.not.equal(4);
          delete res.body.took;
          expect(res.body).to.deep.equal(fixtures.search.query.kartuli);

          done();
        });
    });
  });
});
