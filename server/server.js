/*
  Created by orange1337
*/
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const fs            = require('fs');
const helmet        = require('helmet');
const compression   = require('compression');
const request       = require('request-promise');

const configName    = (process.env.CONFIG_NAME) ? process.env.CONFIG_NAME : 'config';
const config        = require(`./${configName}`);

const customSlack   = require('./modules/slack.module');
const logSlack      = customSlack.configure(config.loggerSlack.alerts);

const EOS           = require('eosjs');
const eos           = EOS(config.eosConfig);

const { asyncWrapper, logWrapper } = require('./utils/main.utils');
const log       = new logWrapper(`server`);
const wrapper   = new asyncWrapper(`server`);

process.on('uncaughtException', (err) => {
    logSlack(` ======= UncaughtException Main Server : `, err);
});

const mongoMain = require('./db/init.db').connect(log);
/**
 * PM2 Metrics
 */
const pm2 = require('@pm2/io');
let metrics = {
   users: pm2.metric({name: 'realtimeUsers'})
};

const app  = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.set('view engine', 'html');
app.set('views', '../dist');

// ################### create http node express server
const debug = require('debug')('asd:server');
const http = require('http');
const port = normalizePort(config.port || '8088');
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.use(express.static(path.join(__dirname, '../dist')));

// ################### Main API
require(`./api/sm.api.${config.apiV}`)(app, config, request, log, mongoMain, eos, wrapper);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

//################### socket io connection
const io = require('socket.io').listen(server);
/*const socketRedis = require('socket.io-redis');
io.adapter(socketRedis({ host: config.REDIS.host, port: config.REDIS.port }));*/
app.use((req, res, next) => {
  req.io = io;
  next();
});
require(`./api/socket.api.${config.apiV}`)(io, app, config, request, log, mongoMain, eos, metrics, wrapper);
//################### end of socket io connection

// ################### catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ################### error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  log.error('===== Page not Found ', err);
  res.status(404).send('Page not found!');
});

function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port; 
  return false;
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      log.error(`${bind} requires elevated privileges`);
      break;
    case 'EADDRINUSE':
      log.error(`${bind} is already in use`);
      break;
    default:
      throw error;
  }
}
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  log.info(`Listening on ${bind}`);
}
