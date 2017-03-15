var debug = require("debug")("lib:search");

/**
 * Process the given string into an array of tokens where each token is
 * either a search criteria or an operator (AND or OR). Also makes each
 * search criteria token lowercase, so that searches will be case-
 * insensitive.
 *
 * @param {String} queryString The string to tokenize.
 *
 * @return {String} The tokenized string.
 */
var processQueryString = function(queryString) {
  if (!queryString) {
    return [];
  }
  // Split on spaces
  var queryArray = queryString.split(' ');

  // Create an array of tokens out of the query string where each token is
  // either a search criteria or an operator (AND or OR).
  var queryTokens = [];
  var currentString = '';
  for (var i in queryArray) {
    var currentItem = queryArray[i].trim();
    if (currentItem.length <= 0) {
      break;
    } else if ((currentItem == 'AND') || (currentItem == 'OR')) {
      queryTokens.push(currentString);
      queryTokens.push(currentItem);
      currentString = '';
    } else if (currentString) {
      /* toLowerCase introduces a bug in search where camel case fields lose their capitals, then can't be matched with fields in the map reduce results */
      currentString = currentString + ' ' + currentItem; //.toLowerCase();
    } else {
      currentString = currentItem; //.toLowerCase();
    }
  }
  queryTokens.push(currentString);

  return queryTokens;
};

var addQueryTokens = function(queryTokens, fuzzy, operator) {
  // hard-coded to fuzzy = true for Claire
  var fuzzy = false;

  // TODO refactor this lib to support boolean groupging
  operator = operator || "AND";
  if (queryTokens.indexOf("OR") > -1) {
    operator = "OR"
  }

  var type = "bool";
  var elasticsearchTemplate = {
    'query': {
      'bool': {
        'must': [],
        'must_not': [],
        'should': []
      }
    },
    'fielddata_fields': 'doc_values',
    'from': 0,
    'size': 50,
    'sort': [],
    // 'facets': {} // all shards failed
  };

  if (fuzzy) {
    type = "fuzzy";
    debug("using fuzzy search");
    elasticsearchTemplate.query.fuzzy = elasticsearchTemplate.query.bool;
    delete elasticsearchTemplate.query.bool;
  }

  for (var token in queryTokens) {
    var pieces = queryTokens[token].split(':');
    if (pieces.length < 2) {
      continue;
    }

    var field = pieces[0];
    var term = {};
    term[field] = pieces[1];

    if (operator === "AND") {
      debug("must have ", term);
      elasticsearchTemplate.query[type].must.push({
        term: term
      });
    } else {
      debug("should have ", term);
      elasticsearchTemplate.query[type].should.push({
        term: term
      });
    }
    // elasticsearchTemplate.query.match[field] = pieces[1];
  }

  debug("elasticsearchTemplate", elasticsearchTemplate.query[type]);
  return elasticsearchTemplate;

};

module.exports.processQueryString = processQueryString;
module.exports.addQueryTokens = addQueryTokens;
