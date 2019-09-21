const app = require('./app');
const config = require('./config');
const http = require('http');
const logger = require('./logger');
const socket = require('./socket');

const httpServer = http.createServer(app.callback());
socket.attach(httpServer);

const start = (options = {}) => {
  const httpOptions = Object.assign(options, config.get('http'));
  httpServer.listen(httpOptions, () => {
    logger.info(`HTTP server listening koa/app on: ${JSON.stringify(httpServer.address())}.`);
  });
};

module.exports = {
  start,
};
