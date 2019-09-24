const SocketIOClient = require('socket.io-client');
const uuid = require('uuid');

class Node {
  constructor (url) {
    this._id = uuid.v4();
    this._url = url;
    this._timestamp = Date.now();
  }

  get id () { return this._id; }
  get url () { return this._url; }
  get io () { return this._io; }
  get timestamp () { return this._timestamp; }

  connect () {
    try {
      this._io = new SocketIOClient(this.url);
      return Promise.resolve(this.io);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  toJSON () {
    return {
      id: this.id,
      url: this.url,
      timestamp: this.timestamp,
    };
  }
}

module.exports = Node;
