var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var mysql = require('mysql');

var dbConfig = require('./dbConfig');
var connection = mysql.createConnection(dbConfig);
connection.connect();


app.post('/saveState', function(req, res) {
  console.info(req.body);
  var data = {state: JSON.stringify(req.body)};
  connection.query('INSERT INTO state SET ?', data, function(err, rows, fields) {
    if (err) throw err;
    connection.query('SELECT * FROM state', function(err, rows, fields) {
      if (err) throw err;
      console.log("/save");
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({states: rows}, null, 3));
    });
    /*
    connection.query('SELECT * FROM state ORDER BY id DESC LIMIT 1', function(err, rows, fields) {
      if (err) throw err;
      console.log("SAVED", rows[0]);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(rows[0], null, 3));
    });
  */
  });
});

app.get('/load', function(req, res) {
  connection.query('SELECT * FROM state', function(err, rows, fields) {
    if (err) throw err;
    console.log("/load");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({states: rows}, null, 3));
  });
});

app.listen(8080);