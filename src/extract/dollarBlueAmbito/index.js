const fetch = require('node-fetch');
const moment = require('moment')

function numberFormat(strValue) {
  return +strValue.replace(/,/g, '.')
}

function getData(fromDate, toDate) {
  return fetch(`https://mercados.ambito.com//dolar/informal/historico-general/${fromDate}/${toDate}`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "es-ES,es;q=0.9,en;q=0.8,gl;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://www.ambito.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then((resp) => {
    return resp.json()
  })
}

const perseData = (allData) => {
  const [header, ...data] = allData
  const resp = data.map((item) => ({
    date: moment(item[0], 'DD-MM-YYYY').toDate(),
    value: numberFormat(item[2])
  }))

  return resp
}


async function main (startDate, endDate) {
  const _starDate = moment(startDate).format('DD-MM-YYYY');
  const _endDate = moment(endDate).format('DD-MM-YYYY');
  return getData(_starDate, _endDate).then(perseData)
}

module.exports = main;