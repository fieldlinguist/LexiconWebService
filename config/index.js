var fs = require('fs');

var config = {
  url: 'https://localhost:3185',
  ssl: {
    key: fs.readFileSync(__dirname + '/fielddb_debug.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/fielddb_debug.crt', 'utf8')
  }
};

module.exports = config;
