const SocketEventTypes = require('../models/SocketEventTypes');
const socketIOServer = require('../socket-io-server');
const Transaction = require('../models/Transaction');
const transactionRepository = require('../repository/transactionRepository');

const addTransaction = (amount, receiver, sender) => {
  const transaction = Transaction.new(amount, receiver, sender);
  socketIOServer.io.emit(SocketEventTypes.TRANSACTION_ADD, transaction);
  return Promise.resolve(transaction);
};

const listTransactions = () => transactionRepository.listTransactions();

const receiveTransaction = (rawTransaction) => {
  const transaction = Transaction.fromObject(rawTransaction);
  transactionRepository.addTransaction(transaction);
  if (transactionRepository.countTransactions() > 1) {
    socketIOServer.io.emit(SocketEventTypes.MINER_START, transactionRepository.nextTransaction());
  }
  return Promise.resolve();
};

const removeTransaction = (id) => transactionRepository.removeTransaction(id);

const transactionController = {
  addTransaction,
  listTransactions,
  receiveTransaction,
  removeTransaction,
};

module.exports = transactionController;
