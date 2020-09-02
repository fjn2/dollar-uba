var express = require('express');
var cors = require('cors');
var app = express();
const consolidate = require('./src/extract/consolidate');

let data;

app.use(cors());

app.get('/', async (req, res) => {
  let frula;

  if (data) {
    frula = data;
  }
  frula = await consolidate().then(_data => {
    data = _data;
    return data;
  })
  
  let dollarValue = 0
  const linePathDollar = 'M0 0 ' + Object.keys(frula).map((key, index) => {
    dollarValue = frula[key].dollar ? frula[key].dollar : dollarValue
    return `L${index} ${dollarValue}`
  }).concat(' ')

  let uvaValue = 0
  const linePathUva = 'M0 0 ' + Object.keys(frula).map((key, index) => {
    uvaValue = frula[key].dollar ? frula[key].uba : uvaValue
    return `L${index} ${uvaValue}`
  }).concat(' ')

  res.send(`
  <html>
    <head>
    </head>
    <body>
        <svg height="200" width="400" style="fill: none; stroke: #000; stroke-width: 1.5px;transform: scaleY(-1);">
          <path d="${linePathDollar}" />
          <path d="${linePathUva}" />
        </svg>
      </figure>
      
    </body>
  </html>
  `);
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});