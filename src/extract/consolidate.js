const moment = require('moment');
const blue = require('./dollarBlue');
const uba = require('./uba');

const consolidate = ([uba, dollar]) => {
  const resp = {};
  uba.forEach((val) => {
    const key = moment(val.date).format('YYYY-MM-DD');
    resp[key] = resp[key] || {}
    resp[key].uba = val.value
  })
  dollar.forEach((val) => {
    const key = moment(val.date).format('YYYY-MM-DD');
    resp[key] = resp[key] || {}
    resp[key].dollar = val.value
  })

  return resp;
}

const main = () => {
  const START_DATE = moment('01-01-2019', 'DD-MM-YYYY')
  const END_DATE = moment();

  return Promise.all([
    uba(START_DATE, END_DATE),
    blue(START_DATE, END_DATE),

  ]).then(consolidate)
}

module.exports = main;

