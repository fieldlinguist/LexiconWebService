module.exports = {
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 4,
    "max_score": 1,
    "hits": [{
      "_index": "testinglexicon-kartuli",
      "_type": "datum",
      "_id": "3328d6a49281e117e859adddcd026851",
      "_score": 1,
      "_source": {
        "translation": "It's difficult to explain.",
        "validationStatus": "ToBeElicited",
        "enteredByUser": "gina",
        "context": "(start a slow explanation or at least imply that something is lost in the translation)",
        "goal": "Sample data for the Learn X screenshots",
        "consultants": "girl2",
        "dialect": "Unknown",
        "language": "Geogian",
        "dateElicited": "Mar 7, 2013",
        "user": "gina",
        "dateSEntered": "2014-03-15T04:49:26.624Z"
      }
    }, {
      "_index": "testinglexicon-kartuli",
      "_type": "datum",
      "_id": "d3bf748b16ac4054680f27a6401be629",
      "_score": 1,
      "_source": {
        "utterance": "alo",
        "morphemes": "alo",
        "gloss": "alo",
        "translation": "Hello?",
        "validationStatus": "Checked",
        "enteredByUser": "gina",
        "modifiedByUser": "gina",
        "orthography": "ალო",
        "context": "only on the phone",
        "goal": "Frequent phrases uttered in natural contexts which learners can review by watching/listening to the movie ჩემი ცოლის დაქალის ქორწილი [HD].mp4",
        "dateElicited": "2013",
        "media": [{
          "filename": "alo.mp3"
        }]
      }
    }, {
      "_index": "testinglexicon-kartuli",
      "_type": "datum",
      "_id": "3328d6a49281e117e859adddcd006168",
      "_score": 1,
      "_source": {
        "translation": "I don't want any, thanks.",
        "validationStatus": "ToBeElicited",
        "enteredByUser": "gina",
        "context": "(efficiently refusing a beach vendor)",
        "goal": "Sample data for the Learn X screenshots",
        "consultants": "girl2",
        "dialect": "Unknown",
        "language": "Geogian",
        "dateElicited": "Mar 7, 2013",
        "user": "gina",
        "dateSEntered": "2014-03-15T04:49:26.624Z"
      }
    }, {
      "_index": "testinglexicon-kartuli",
      "_type": "datum",
      "_id": "d3bf748b16ac4054680f27a6401c757e",
      "_score": 1,
      "_source": {
        "utterance": "ar minda",
        "morphemes": "ar minda",
        "gloss": "not I.want",
        "translation": "I don't want this/that.",
        "tags": "SampleData",
        "validationStatus": "Checked",
        "enteredByUser": "gina",
        "modifiedByUser": "gina, nemo33",
        "orthography": "არ მინდა",
        "goal": "Frequent phrases uttered in natural contexts which learners can review by watching/listening to the movie ჩემი ცოლის დაქალის ქორწილი [HD].mp4",
        "dateElicited": "2013",
        "media": [{
          "filename": "ar_minda_es_elene.mp3"
        }, {
          "filename": "deda_me_ar_minda_kortsvili.mp3"
        }]
      }
    }]
  },
  "original": {
    "query": {
      "fuzzy": {
        "utterance": {
          "value": "ar"
        }
      }
    },
    "from": 0,
    "size": 50,
    "sort": [],
    "facets": {}
  }
};
