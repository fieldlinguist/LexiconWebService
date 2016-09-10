"use strict";
var expect = require("chai").expect;
var supertest = require("supertest");

var api = require("../../");

/**
 * https://lexicondev.example.org/analysisbytierbyword/inuktitut/nunaqjuaqli
 * aaqkiksimalaunngilaq
 * sunataqaranilu
 * itijuqjuamik
 * taaqtualuulluni
 * guutiullu
 * anirngninga
 * ingirralauqpuq
 * imaaluup
 * qulaagut
 */
describe("/v1", function() {
  describe("GET inuktitut", function() {
    this.timeout(10 * 1000);

    describe("farley's Uqailaut", function() {
      it("should analyze nuna", function(done) {
        supertest(api)
          .get("/farley/inuktitut/nuna")
          .expect("Content-Type", "application/json; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            console.log(res.body);
            expect(res.body).to.deep.equal({
              output: ["{nuna:nuna/1n}"]
            });

            done();
          });
      });

      it("should analyze nunaqjuaqli", function(done) {
        supertest(api)
          .get("/farley/inuktitut/nunaqjuaqli")
          .expect("Content-Type", "application/json; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            console.log(res.body);
            expect(res.body).to.deep.equal({
              output: []
            });

            done();
          });
      });

      it("should analyze aaqkiksimalaunngilaq", function(done) {
        supertest(api)
          .get("/farley/inuktitut/aaqkiksimalaunngilaq")
          .expect("Content-Type", "application/json; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            console.log(res.body);
            expect(res.body).to.deep.equal({
              output: []
            });

            done();
          });
      });

      it("should analyze sunataqaranilu", function(done) {
        supertest(api)
          .get("/farley/inuktitut/sunataqaranilu")
          .expect("Content-Type", "application/json; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            console.log(res.body);
            expect(res.body).to.deep.equal({
              output: ["{su:su/1v}{na:naq/2vn}{taqa:taqaq/1nv}{rani:nani/tv-part-3s}{lu:lu/1q}"]
            });

            done();
          });
      });

      it("should analyze itijuqjuamik", function(done) {
        supertest(api)
          .get("/farley/inuktitut/itijuqjuamik")
          .expect("Content-Type", "application/json; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            console.log(res.body);
            expect(res.body).to.deep.equal({
              output: []
            });

            done();
          });
      });

      it("should analyze taaqtualuulluni", function(done) {
        supertest(api)
          .get("/farley/inuktitut/taaqtualuulluni")
          .expect("Content-Type", "application/json; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            console.log(res.body);
            expect(res.body).to.deep.equal({
              output: ["{taaq:taaq/1v}{tu:juq/1vn}{alu:aluk/1nn}{u:u/1nv}{lluni:luni/tv-part-3s-prespas}"]
            });

            done();
          });
      });
    });

    it("should generate an tiered analysis by word", function(done) {
      supertest(api)
        .get("/analysisbytierbyword/inuktitut/taaqtualuulluni")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log(res.body);
          expect(res.body).to.deep.equal({
            analysisByTierByWord: {
              allomorphs: {
                taaqtualuulluni: [
                  "taaq-tu-alu-u-lluni"
                ]
              },
              morphemes: {
                taaqtualuulluni: [
                  "taaq-juq-aluk-u-luni"
                ]
              },
              glosses: {
                taaqtualuulluni: [
                  "1v-1vn-1nn-1nv-tv.part.3s.prespas"
                ]
              }
            },
            farley: {
              taaqtualuulluni: [
                "{taaq:taaq/1v}{tu:juq/1vn}{alu:aluk/1nn}{u:u/1nv}{lluni:luni/tv-part-3s-prespas}"
              ]
            }
          });

          done();
        });
    });

    it("should generate allomorphs", function(done) {
      supertest(api)
        .get("/allomorphs/inuktitut/taaqtualuulluni")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log(res.body);
          expect(res.body).to.deep.equal({
            taaqtualuulluni: ["taaq-tu-alu-u-lluni"]
          });

          done();
        });
    });

    it("should generate morephems", function(done) {
      supertest(api)
        .get("/morphemes/inuktitut/taaqtualuulluni")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log(res.body);
          expect(res.body).to.deep.equal({
            taaqtualuulluni: ["taaq-juq-aluk-u-luni"]
          });

          done();
        });
    });

    it("should generate a gloss", function(done) {
      supertest(api)
        .get("/gloss/inuktitut/taaqtualuulluni")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log(res.body);
          expect(res.body).to.deep.equal({
            taaqtualuulluni: ["1v-1vn-1nn-1nv-tv.part.3s.prespas"]
          });

          done();
        });
    });
  });
});
