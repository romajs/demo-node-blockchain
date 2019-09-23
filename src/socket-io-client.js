const SocketIO = require('socket.io-client');
const logger = require('./logger');

class SocketIOClient {
  connect (url) {
    try {
      this._io = new SocketIO(url);
      logger.info('socket.io client connected to', url);
      return Promise.resolve(this.io);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get io () {
    return this._io;
  }
}

const socketIOClient = new SocketIOClient();

module.exports = socketIOClient;
