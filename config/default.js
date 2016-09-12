var url = require("url");

module.exports = {
  corpusOptions: url.parse(process.env.FIELDDB_DATABASE_URL || "http://public:none@localhost:5984"),
  searchOptions: url.parse(process.env.FIELDDB_SEARCH_URL || "http://admin:none@localhost:9200")
};
