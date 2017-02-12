module.exports = {
  corpus: {
    url: process.env.FIELDDB_DATABASE_URL || "http://public:none@localhost:5984"
  },
  search: {
    url: process.env.FIELDDB_SEARCH_URL || "http://admin:none@localhost:9200"
  }
};
