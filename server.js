var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var solrClient = require('./solr-client').Client;
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

// connect to solr
solr = new solrClient({host: 'localhost', port: 8983, core: 'solr_core'});

// home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'welcome to cassandra and solr integration demo'
  });
});

// insert book
app.post('/insert', (req, res) => {

  var query = `INSERT INTO books (id, title, description) 
  VALUES (${uuid()}, '${req.body.title}', '${req.body.description}')`;

  // execute the query
  client.execute(query, (err, result) => {
    if (err) {
      res.json({
        success: false,
        message: err.message
      })
    }
    else {
      res.json({
        success: true,
        message: 'book inserted successfully'
      })
    }
  });
  
  // index the doc to solr
  solr.add(req.body, (res) => {
    console.log(res);
  });
});

// get books
app.get('/get', (req, res) => {
  var query = `SELECT * FROM books`;
  client.execute(query, (err, result) => {
    if (!err) {
      res.json({
        success: true,
        books: result.rows
      })
    }
  });
});

// update book
app.post('/update', (req, res) => {
  var book = {
    id: req.query.id,
    title: req.body.title,
    description: req.body.description
  };
  var query = `UPDATE books SET title = '${book.title}', description = '${book.description}' WHERE id = ${book.id}`;
  client.execute(query, (err, result) => {
    if (!err) {
      res.json({
        success: true,
        message: 'book updated successfully'
      })
    }
    else {
      res.json({
        success: false,
        err
      })
    }
  });
});

// delete book
app.get('/delete', (req, res) => {
  var query = `DELETE FROM books WHERE id = ${req.query.id}`;
  client.execute(query, (err, result) => {
    if (!err) {
      res.json({
        success: true,
        message: 'book deleted successfully'
      })
    }
    else {
      res.json({
        success: false,
        err
      })
    }
  });
});

// search indexed books
app.get('/search', (req, res) => {
  solr.search(req.query.q, (docs) => {
    res.json(docs);
  })
})