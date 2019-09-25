const childProcess = require('child_process');
const app = require('./app');
const chainManager = require('./chainManager');
const config = require('./config');
const EventTypes = require('./models/EventTypes');
const http = require('http');
const logger = require('./logger');
const path = require('path');
const socketIOClient = require('./socket-io-client');
const socketIOServer = require('./socket-io-server');
const transactionService = require('./services/transactionService');

const CHILD_NAME = path.join(__dirname, 'miner.js');
let minerFork = null;

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

socketIOClient.connect(serverUrl).then((io) => {
  io.on(EventTypes.TRANSACTION_ADD, (rawTransaction) => {
    logger.info('Received transaction:', rawTransaction);
    transactionService.receiveTransaction(rawTransaction);
  });
  io.on(EventTypes.MINE_START, (transaction) => {
    logger.info('Starting miner child/fork for transaction.id:', transaction.id);
    minerFork = childProcess.fork(CHILD_NAME);
    minerFork.on('message', (block) => {
      logger.info('Forged block:', block);
      socketIOServer.io.emit(EventTypes.MINE_STOP, block);
    });
    minerFork.send({ transaction });
  });
  io.on(EventTypes.MINE_STOP, (block) => {
    logger.info('Stopping previous miner child/fork:', minerFork.pid);
    if (minerFork !== null && !minerFork.killed) {
      minerFork.kill();
      minerFork = null;
    }
    chainManager.appendBlock(block).then(() => {
      transactionService.removeTransaction(block.data.transaction.id);
    });
  });
  return io;
});

const start = (options = {}) => {
  const httpOptions = Object.assign(options, config.get('http'));
  httpServer.listen(httpOptions, () => {
    logger.info('HTTP server listening koa/app on:', httpServer.address());
  });
};

module.exports = {
  start,
};
