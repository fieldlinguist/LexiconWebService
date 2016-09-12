module.exports = {
  "testinglexicon-kartuli": {
    "aliases": {},
    "mappings": {
      "datum": {
        "properties": {
          "consultants": {
            "type": "string"
          },
          "context": {
            "type": "string"
          },
          "dateElicited": {
            "type": "string"
          },
          "dateSEntered": {
            "type": "date",
            "format": "strict_date_optional_time||epoch_millis"
          },
          "dialect": {
            "type": "string"
          },
          "enteredByUser": {
            "type": "string"
          },
          "gloss": {
            "type": "string"
          },
          "goal": {
            "type": "string"
          },
          "language": {
            "type": "string"
          },
          "media": {
            "properties": {
              "filename": {
                "type": "string"
              }
            }
          },
          "modifiedByUser": {
            "type": "string"
          },
          "morphemes": {
            "type": "string"
          },
          "orthography": {
            "type": "string"
          },
          "tags": {
            "type": "string"
          },
          "translation": {
            "type": "string"
          },
          "user": {
            "type": "string"
          },
          "utterance": {
            "type": "string"
          },
          "validationStatus": {
            "type": "string"
          }
        }
      }
    },
    "settings": {
      "index": {
        "creation_date": "1473635826394",
        "numberOfShards": "1",
        "numberOfReplicas": "1",
        "uuid": "eVi-y1qgSfmodtEpj8nD0Q",
        "version": {
          "created": "2040099"
        }
      }
    },
    "warmers": {}
  }
};
