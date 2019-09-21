const blockchain = require('./blockchain');
const chainManager = require('./chainManager');
const logger = require('./logger');
const SocketIO = require('socket.io');

class Socket {
  attach (httpServer) {
    this._io = new SocketIO(httpServer);
    logger.info('socket.io attached to HTTP server.');
    this._io.on('connection', socket => {
      logger.info('Client connected.');
      socket.on('disconnect', () => {
        logger.info('Client disconnected.');
      });
      socket.on('register', id => {
        logger.info('Client registering with id:', id);
      });
      socket.on('forge-block', async (minerId, block) => {
        logger.info('Received forged block:', block, 'from:', minerId);
        const chain = await chainManager.getChain();
        chain.concat(block);
        const isValidChain = blockchain.validateChain(chain);
        logger.info('isValidChain:', isValidChain);
        if (isValidChain) {
          chainManager.appendBlock(block);
        }
      });
    });
  }

  get io () {
    return this._io;
  }
}

module.exports = new Socket();
