var express = require('express');
var cors = require('cors');
var app = express();
const consolidate = require('./extract/consolidate');

let data;

app.use(cors());

app.get('/', function (req, res) {
  if (data) {
    res.json(data);
    return ;
  }
  consolidate().then(_data => {
    data = _data;
    res.json(data);
  })
});

app.listen(3030, function () {
  console.log('Example app listening on port 3000!');
});