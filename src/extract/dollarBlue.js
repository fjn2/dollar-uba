const fetch = require('node-fetch');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const moment = require('moment');

const requestToFalop = (date) => {
  return fetch("https://www.cotizacion-dolar.com.ar/dolar-blue-historico-2019.php", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "es-ES,es;q=0.9,en;q=0.8,gl;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrer": "https://www.cotizacion-dolar.com.ar/dolar-blue-historico-2019.php",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": `fecha=${date}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((resp) => {
    return resp.text()
  });
};

const getNodes = data => {
  var doc = new dom().parseFromString(data)
  const resp = [];
  var nodes = xpath.select('//div/table[@border="1"]/tbody/tr', doc)
  for (let i = 1; i < nodes.length; i++) {
    try {
      resp.push({
        date: nodes[i].firstChild.firstChild.toString(),
        buy: nodes[i].childNodes[1].childNodes[1].firstChild.toString(),
        sell: nodes[i].childNodes[2].childNodes[1].firstChild.toString()
      });
    } catch (e) {
      console.log('Error parsing one row', e)
    }
  }
  return resp
};

const formatNodes = (nodes) => {
  const resp = nodes.map((node) => ({
    date: moment(node.date, 'DD-MM-YY').toDate(),
    value: +node.sell
  }))
  return resp;
};

const getPeriodOfTime = (startDate, endDate) => {
  const timeValues = [];

  while (endDate > startDate || startDate.format('M') === endDate.format('M')) {
    timeValues.push(startDate.format('01-MM-YY'));
    startDate.add(1,'month');
  }
  const requests = timeValues.map((d) => requestToFalop(d).then(getNodes).then(formatNodes))

  return Promise.all(requests).then((responses) => {
    return responses.flat()
  });
}
//*[@id="article1"]/table[2]/tbody/tr

function main (startDate, endDate) {
  return getPeriodOfTime(startDate, endDate)
}

module.exports = main;
