var fs = require("fs");

var config = {
  corpus: {
    url: "http://public:none@localhost:5984",
    DEFAULT_MAX_INDEX_LIMIT: 20000,
  },
  search: {
    url: "http://admin:none@localhost:9200",
    DEFAULT_MAX_INDEX_LIMIT: 20000,
  },
  url: "https://localhost:3185",
  ssl: {
    key: fs.readFileSync(__dirname + "/fielddb_debug.key", "utf8"),
    cert: fs.readFileSync(__dirname + "/fielddb_debug.crt", "utf8")
  }
};

console.log("Loaded default config");
module.exports = config;
