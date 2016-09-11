module.exports = {
  corpusOptions: {
    protocol: "http://",
    host: "localhost",
    defaultPort: "5984",
    mehod: "GET",
    path: "",
    headers: {
      "Content-Type": "application/json"
    }
  },
  searchOptions: {
    protocol: "http://",
    defaultPort: "3195",
    host: "localhost",
    path: "/default/datums/_search",
    method: "POST",
    headers: ""
  }
};
