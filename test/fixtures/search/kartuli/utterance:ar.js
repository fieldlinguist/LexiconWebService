module.exports = {
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 1.058217,
    "hits": [{
      "_index": "testinglexicon-kartuli",
      "_type": "datum",
      "_id": "d3bf748b16ac4054680f27a6401c757e",
      "_score": 1.058217,
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
        "orthography": {
          "value": "არ"
        }
      }
    },
    "fielddata_fields": "doc_values",
    "from": 0,
    "size": 50,
    "sort": []
  }
};
