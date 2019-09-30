const childProcess = require('child_process');
const app = require('./app');
const chainManager = require('./chain/chainManager');
const config = require('./config');
const SocketEventTypes = require('./models/SocketEventTypes');
const http = require('http');
const logger = require('./logger');
const path = require('path');
const socketIOClient = require('./socket-io-client');
const socketIOServer = require('./socket-io-server');
const transactionService = require('./services/transactionService');

const CHILD_NAME = path.join(__dirname, 'miner/childProcess.js');
let minerFork = null;

const httpServer = http.createServer(app.callback());

socketIOServer.attach(httpServer).then((io) => {
  io.on(SocketEventTypes.CONNECTION, (socket) => {
    logger.info('Socket connected with id:', socket.id);
    socket.on('disconnect', () => {
      logger.info('Socket disconnected with id:', socket.id);
    });
  });
});

const serverUrl = `http://${config.get('http.host')}:${config.get('http.port')}`;

socketIOClient.connect(serverUrl).then((io) => {
  io.on(SocketEventTypes.TRANSACTION_ADD, (rawTransaction) => {
    logger.info('Received transaction:', rawTransaction);
    transactionService.receiveTransaction(rawTransaction);
  });
  io.on(SocketEventTypes.MINER_START, async (transaction) => {
    logger.info('Starting miner child/fork for transaction.id:', transaction.id);
    minerFork = childProcess.fork(CHILD_NAME);
    minerFork.on('message', (block) => {
      logger.info('Received block from miner:', minerFork.pid, block);
      socketIOServer.io.emit(SocketEventTypes.MINER_STOP, block);
    });
    const previousHash = await chainManager.getLastHash();
    minerFork.send({ transaction, previousHash });
  });
  io.on(SocketEventTypes.MINER_STOP, async (block) => {
    logger.info('Stopping previous miner child/fork from:', minerFork.pid);
    if (minerFork !== null && !minerFork.killed) {
      minerFork.kill();
      minerFork = null;
    }
    await chainManager.addBlock(block);
    // transactionService.removeTransaction(block.data.transaction.id);
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
