const fetch = require('node-fetch');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const moment = require('moment');

const getNodes = data => {
  var doc = new dom().parseFromString(data)
  // var nodes = xpath.select('/html/body/div/div[2]/div/div/div/div/table/tbody', doc)
  var nodes = xpath.select('//div/table/tbody/tr/td', doc)
  return nodes.map((node) => node.firstChild.toString())
};

const formatNodes = (nodes) => {
  const resp = [];
  for (let i = 0; i < nodes.length; i += 2) {
    resp.push({
      date: moment(nodes[i], 'DD/MM/YYYY').toDate(),
      value: +(nodes[i + 1].replace(/,/gi, '.'))
    })
  }
  return resp;
}

const requestToBank = (startDate, endDate) => {
  return fetch("http://www.bcra.gov.ar/PublicacionesEstadisticas/Principales_variables_datos.asp", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "upgrade-insecure-requests": "1"
    },
    "referrer": "http://www.bcra.gov.ar/PublicacionesEstadisticas/Principales_variables_datos.asp?serie=7913&detalle=Unidad%20de%20Valor%20Adquisitivo%20(UVA)%A0(en%20pesos%20-con%20dos%20decimales-,%20base%2031.3.2016=14.05)",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": `fecha_desde=${startDate}&fecha_hasta=${endDate}&B1=Enviar&primeravez=1&fecha_desde=&fecha_hasta=&serie=7913&serie1=0&serie2=0&serie3=0&serie4=0&detalle=Unidad+de+Valor+Adquisitivo+%28UVA%29%A0%28en+pesos+-con+dos+decimales-%2C+base+31.3.2016%3D14.05%29`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((resp) => {
    return resp.text()
  })
}

function main (startDate, endDate) {
  const _starDate = moment(startDate).format('YYYY-MM-DD');
  const _endDate = moment(endDate).format('YYYY-MM-DD');
  return requestToBank(_starDate, _endDate).then(getNodes).then(formatNodes);
}

module.exports = main;
