
const router = require('express').Router();
const js2xmlparser = require('js2xmlparser');
const estimator = require('../../estimator');
// const xml = require('xml')
// import estimator from '../../estimator'
router.post('/on-covid-19', (req, res) => {
  const { data } = req.body;
  console.log(req.body);
  const output = estimator(data);
  return res.status(200).json({ output });
});
router.post('/on-covid-19/xml-p', async (req, res) => {
  const { root } = req.body;
  // console.log(req.body)
  let output = estimator(root);
  // output = JSON.stringify(output);
  output = await js2xmlparser.parse('root', output);
  //  console.log(output)
  return res.set('Content-Type', 'text/xml').status(200).send(output);
});
router.post('/on-covid-19/xml', async (req, res) => {
  const { root } = req.body;
  // console.log(req.body)
  const data = root.data[0];
  const newData = {
    region: {
      avgAge: parseFloat(data.region[0].avgage[0]),
      avgDailyIncomeInUSD: parseFloat(data.region[0].avgdailyincomeinusd[0]),
      avgDailyIncomePopulation: parseFloat(data.region[0].avgdailyincomepopulation[0]),
      name: data.region[0].name[0]
    },
    periodType: data.periodtype[0],
    population: parseFloat(data.population[0]),
    reportedCases: parseFloat(data.reportedcases[0]),
    totalHospitalBeds: parseFloat(data.totalhospitalbeds[0]),
    timeToElapse: parseFloat(data.timetoelapse[0])
  };
  let output = estimator(newData);
  output = JSON.stringify(output);
  output = await js2xmlparser.parse('root', output);

  return res.set('Content-Type', 'text/xml').status(200).send(output);
});


module.exports = router;
