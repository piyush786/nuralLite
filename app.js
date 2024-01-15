const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const config = require('./config/config.json')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const app = new express()
const mongoose = require('./config/database');
const consoleLine = require('./plugins/consoleLine')
const YAML = require('yaml')
const swaggerUi = require('swagger-ui-express');

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }
  return compression.filter(req, res)
}

const accessLogStream = fs.createWriteStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(consoleLine);
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(cors());
app.use(morgan('tiny'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(compression({ filter: shouldCompress }));  // enable compress
app.use(express.static('public'));
app.use('/api/v1',routes);  // using routing


//Server Start
app.listen(
    process.env.PORT || config.server.port,
    config.server.host || '0.0.0.0', 
    () => console.log(`Server Started on ${ (config.server.host ? config.server.host : '0.0.0.0') }:${ process.env.PORT ? process.env.PORT : config.server.port }`)
)