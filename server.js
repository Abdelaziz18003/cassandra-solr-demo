var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');

// create the server
var app = express();
app.listen(3000);
app.use(bodyParser.urlencoded({extended: false}));

// connect to the cassandra database
var client = new cassandra.Client({
  contactPoints: ['localhost'],
  keyspace: 'demo'
});

client.connect((err) => {
  if (err) {
    console.log('could not connect to keyspace demo');
  }
  else {
    console.log('connected successfully to keyspace demo');
  }
  console.log('server started at http://localhost:3000 ...');
});

// handle requests
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'welcome to cassandra and solr integration demo'
  });
});