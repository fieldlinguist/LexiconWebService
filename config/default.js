var url = require("url");

module.exports = {
  corpusOptions: url.parse("http://public:none@localhost:5984"),
  searchOptions: url.parse("http://admin:none@localhost:9200/public/data")
};
