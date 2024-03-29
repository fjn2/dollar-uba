const moment = require('moment');
const blue = require('./dollarBlueAmbito');
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

  // complete empty values
  Object.keys(resp).forEach((key, index) => {
    const item = resp[key]
    if (index === 0 && !item.dollar) {
      item.dollar = 0
    } else if (!item.dollar) {
      item.dollar = resp[Object.keys(resp)[index - 1]].dollar
    }
  })

  return resp;
}

const main = () => {
  const START_DATE = moment('01-01-2020', 'DD-MM-YYYY')
  const END_DATE = moment();

  return Promise.all([
    uba(START_DATE, END_DATE),
    blue(START_DATE, END_DATE),

  ]).then(consolidate)
}
// To test
//const START_DATE = moment('01-08-2020', 'DD-MM-YYYY')
//const END_DATE = moment();
// uba(START_DATE, END_DATE).then(console.log)
//blue(START_DATE, END_DATE).then(console.log)

module.exports = main;

