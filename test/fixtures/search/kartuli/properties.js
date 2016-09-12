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
          "field1": {
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
      },
      "type1": {
        "properties": {
          "field1": {
            "type": "string"
          }
        }
      }
    },
    "settings": {
      "index": {
        "creation_date": "1473635826394",
        "number_of_shards": "5",
        "number_of_replicas": "1",
        "uuid": "eVi-y1qgSfmodtEpj8nD0Q",
        "version": {
          "created": "2040099"
        }
      }
    },
    "warmers": {}
  }
};
