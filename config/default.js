var fs = require("fs");

var config = {
  corpus: {
    url: "http://public:none@localhost:5984"
  },
  search: {
    url: "http://admin:none@localhost:9200"
  },
  url: "https://localhost:3185",
  ssl: {
    key: fs.readFileSync(__dirname + "/fielddb_debug.key", "utf8"),
    cert: fs.readFileSync(__dirname + "/fielddb_debug.crt", "utf8")
  }
};
