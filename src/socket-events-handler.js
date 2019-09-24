const { fork } = require('child_process');
const chainManager = require('./chainManager');
const EventTypes = require('./models/EventTypes');
const logger = require('./logger');
const path = require('path');
const socketIOServer = require('./socket-io-server');
const transactionsPool = require('./transactionsPool');

const CHILD_NAME = path.join(__dirname, 'miner.js');
let minerFork = null;

const handle = (io) => {
  io.on(EventTypes.TRANSACTION_ADD, (transaction) => {
    logger.info('Received transaction:', transaction);
    transactionsPool.add(transaction);
  });
  io.on(EventTypes.MINE_START, (transaction) => {
    logger.info('Starting miner child/fork for transaction.id:', transaction._id);
    minerFork = fork(CHILD_NAME);
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
    chainManager.appendBlock(block);
  });
  return io;
};

module.exports = {
  handle,
};
