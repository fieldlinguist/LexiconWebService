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

var addQueryTokens = function(queryTokens, fuzzy) {

  // hard-coded to fuzzy = true for Claire
  var fuzzy = true;

  if (!fuzzy) {
    var elasticsearchTemplate = {
      'query': {
        'match': {}
      },
      // 'fielddata_fields': 'doc_values',
      // 'from': 0,
      // 'size': 50,
      // 'sort': [],
      // 'facets': {} // all shards failed
    };

    for (var token in queryTokens) {
      var pieces = queryTokens[token].split(':');
      if (pieces.length < 2)
        continue;

      var field = pieces[0];
      var term = {};
      term[field] = pieces[1];

      elasticsearchTemplate.query.match[field] = pieces[1];
    }

    return elasticsearchTemplate;

  }

  if (fuzzy) {
    var elasticsearchFuzzyTemplate = {
      'query': {
        'fuzzy': {},
      },
      'fielddata_fields': 'doc_values',
      'from': 0,
      'size': 50,
      'sort': [],
      // 'facets': {} // all shards failed
    };

    for (var token in queryTokens) {
      var pieces = queryTokens[token].split(':');
      if (pieces.length < 2)
        continue;

      var field = pieces[0];
      var term = pieces[1];

      elasticsearchFuzzyTemplate.query.fuzzy[field] = {
        'value': term,
        // 'fuzziness': 1,
        // 'boost': 1.0,
        // 'min_similarity': 0.5,
        // 'prefix_length': 0
      };
    }

    console.log(elasticsearchFuzzyTemplate);
    return elasticsearchFuzzyTemplate;
  }


};

module.exports.processQueryString = processQueryString;
module.exports.addQueryTokens = addQueryTokens;
