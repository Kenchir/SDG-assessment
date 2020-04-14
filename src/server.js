
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const xmlparser = require('express-xml-bodyparser');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const morgan = require('morgan');

const server = http.createServer(app);
const PORT = process.env.PORT || 8081;
const IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP;

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.use(morgan('dev'));

// log all requests to access.log
app.use(morgan('tiny', {
  stream: fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' })
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(xmlparser({
  explicitArray: false,
  normalize: false,
  normalizeTags: false,
  trim: true
}));
app.use(require('./routes'));

// app.get("/",(req,res)=>{res.send('Hi sir')});
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}


server.listen(PORT, IP);
