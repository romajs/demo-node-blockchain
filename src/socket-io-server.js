const logger = require('./logger');
const SocketIO = require('socket.io');

class SocketIOServer {
  attach (httpServer) {
    try {
      this._io = new SocketIO(httpServer);
      logger.info('socket.io attached to HTTP server.');
      return Promise.resolve(this.io);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get io () {
    return this._io;
  }
}

const socketIOServer = new SocketIOServer();

module.exports = socketIOServer;
