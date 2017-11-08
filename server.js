var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var uuid = cassandra.types.Uuid.random;

// create the server
var app = express();
app.listen(3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

// home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'welcome to cassandra and solr integration demo'
  });
});

// insert book
app.post('/insert', (req, res) => {
  var query = `INSERT INTO books (id, title, description) VALUES (${uuid()}, '${req.body.title}', '${req.body.description}')`;
  console.log(req.body)
  client.execute(query, (err) => {
    if (err) {
      res.json({
        success: false,
        message: result.message
      })
    }
    else {
      res.json({
        success: true,
        message: 'book inserted successfully'
      })
    }
  });
});
