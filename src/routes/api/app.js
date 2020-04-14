
const router = require('express').Router();
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
const path = require('path');
const estimator = require('../../estimator');
// const xml = require('xml')
// import estimator from '../../estimator'
router.post('/on-covid-19', (req, res) => {
  const { data } = req.body;
  // console.log(req.body);
  const output = estimator(data);
  return res.status(200).json({ output });
});
router.post('/on-covid-19/json', (req, res) => {
  const { data } = req.body;
  // console.log(req.body);
  const output = estimator(data);
  return res.status(200).json({ output });
});
router.post('/on-covid-19/xml', async (req, res) => {
  const { root } = req.body;

  let output = estimator(root);
  output = await js2xmlparser.parse('root', output);
  return res.set('Content-Type', 'text/xml').status(200).send(output);
});

router.get('/on-covid-19/logs', async (req, res) => {
  const log = fs.readFileSync(path.join(__dirname, '../../logs.txt'));
  return res.type('text/plain')
    .status(200).send(log);
});


module.exports = router;
