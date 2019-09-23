const uuid = require('uuid');

class Transaction {
  constructor (amount, receiver, sender) {
    this._id = uuid.v4();
    this._amount = amount;
    this._receiver = receiver;
    this._sender = sender;
    this._timestamp = Date.now();
  }

  get id () { return this._id; }
  get amount () { return this._amount; }
  get receiver () { return this._receiver; }
  get sender () { return this._sender; }
  get timestamp () { return this._timestamp; }
}

module.exports = Transaction;
