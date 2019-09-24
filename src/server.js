const app = require('./app');
const config = require('./config');
const EventTypes = require('./models/EventTypes');
const http = require('http');
const logger = require('./logger');
const socketEventsHandler = require('./socket-events-handler');
const socketIOClient = require('./socket-io-client');
const socketIOServer = require('./socket-io-server');

const httpServer = http.createServer(app.callback());

socketIOServer.attach(httpServer).then((io) => {
  io.on(EventTypes.CONNECTION, (socket) => {
    logger.info('Socket connected with id:', socket.id);
    socket.on('disconnect', () => {
      logger.info('Socket disconnected with id:', socket.id);
    });
  });
});

const serverUrl = `http://${config.get('http.host')}:${config.get('http.port')}`;

socketIOClient.connect(serverUrl).then(socketEventsHandler.handle);

const start = (options = {}) => {
  const httpOptions = Object.assign(options, config.get('http'));
  httpServer.listen(httpOptions, () => {
    logger.info('HTTP server listening koa/app on:', httpServer.address());
  });
};

module.exports = {
  start,
};
