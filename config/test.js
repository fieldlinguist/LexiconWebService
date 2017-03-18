module.exports = {
  corpus: {
    url: process.env.CORPUS_URL
  },
  search: {
    url: process.env.SEARCH_URL
  }
};
console.log("Loaded test config");

// Normalize the env var to be falsy
if (process.env.TRAVIS_PULL_REQUEST === "false") {
  delete process.env.TRAVIS_PULL_REQUEST;
}
