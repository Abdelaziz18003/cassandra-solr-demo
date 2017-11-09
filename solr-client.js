const request = require('request');

module.exports.Client = class Client {
  constructor (config) {
    this.host = config.host;
    this.port = config.port;
    this.core = config.core;
  }

  search (query, callback) {
    request.get(
      {
        url: `http://${this.host}:${this.port}/solr/${this.core}/select`,
        qs: {
          q: query,
          wt: 'json',
          indent: 'off'
        }
      },
      (err, res, body) => {
        callback(JSON.parse(body));
      }
    )
  }

  add (doc, callback) {
    request.post({
      url: `http://${this.host}:${this.port}/solr/${this.core}/update/json/docs?commit=true`,
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(doc)
    },(err, res, body) => {
      callback(body);
    })
  }
}
