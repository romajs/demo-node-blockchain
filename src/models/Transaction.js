const uuid = require('uuid');

class Transaction {
  constructor (id, amount, receiver, sender, timestamp) {
    this._id = id;
    this._amount = amount;
    this._receiver = receiver;
    this._sender = sender;
    this._timestamp = timestamp;
  }

  get id () { return this._id; }
  get amount () { return this._amount; }
  get receiver () { return this._receiver; }
  get sender () { return this._sender; }
  get timestamp () { return this._timestamp; }

  toJSON () {
    return {
      id: this.id,
      amount: this.amount,
      receiver: this.receiver,
      sender: this.sender,
      timestamp: this.timestamp,
    };
  }
}

Transaction.new = (amount, receiver, sender) => {
  return new Transaction(uuid.v4(), amount, receiver, sender, Date.now()); ;
};

Transaction.fromObject = ({ id, amount, receiver, sender, timestamp }) => {
  return new Transaction(id, amount, receiver, sender, timestamp);
};

module.exports = Transaction;
