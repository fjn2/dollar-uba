var express = require('express');
var cors = require('cors');
var app = express();
const consolidate = require('./src/extract/consolidate');

let data;

app.use(cors());

app.get('/data', async (req, res) => {
  frula = await consolidate().then(_data => {
    data = _data;
    return data;
  })
  res.send(frula)
})

app.get('/', async (req, res) => {
  res.send(`
  <html>
    <head>
      <script src="https://d3js.org/d3.v4.js"></script>
    </head>
    <body>
        <div id="my_dataviz"></div>
        <script>
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 660 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        //Read the data
        d3.json("/data",

          // Now I can use this dataset:
          function(data) {

            // Add X axis --> it is a date format
            var x = d3.scaleTime()
              .domain(d3.extent(Object.keys(data), function(d) { return d3.timeParse("%Y-%m-%d")(d) }))
              .range([ 0, width ]);
            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
              .domain([0, 400])
              .range([ height, 0 ]);
            svg.append("g")
              .call(d3.axisLeft(y));

            // Add the line
            svg.append("path")
              .datum(Object.keys(data))
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 1.5)
              .attr("d", d3.line()
                .x(function(key) { return x(d3.timeParse("%Y-%m-%d")(key)) })
                .y(function(key) { return y(data[key].uba) })
                )
            svg.append("path")
              .datum(Object.keys(data))
              .attr("fill", "none")
              .attr("stroke", "green")
              .attr("stroke-width", 1.5)
              .attr("d", d3.line()
                .x(function(key) { return x(d3.timeParse("%Y-%m-%d")(key)) })
                .y(function(key) { return y(data[key].dollar) })
                )
            svg.append("path")
              .datum(Object.keys(data))
              .attr("fill", "none")
              .attr("stroke", "red")
              .attr("stroke-width", 1.5)
              .attr("d", d3.line()
                .x(function(key) { return x(d3.timeParse("%Y-%m-%d")(key)) })
                .y(function(key) { return y(data[key].dollar / data[key].uba * 100) })
                )
        })

        </script>
        <div>
          <label>Reference: green -> Dollar blue</label>
          <br />
          <label>Reference: steelblue -> UBA</label>
          <br />
          <label>Reference: red -> Diference</label>
        </div>
    </body>
  </html>
  `);
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});