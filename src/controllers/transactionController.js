const transactionService = require('../services/transactionService');

const addTransaction = async (ctx) => {
  // TODO: validate transaction schema
  const { amount, receiver, sender } = ctx.request.body;
  const transaction = await transactionService.addTransaction(amount, receiver, sender);
  ctx.body = { id: transaction.id };
};

const listTransactions = async (ctx) => {
  const transactions = await transactionService.listTransactions();
  ctx.body = transactions;
};

const transactionController = {
  addTransaction,
  listTransactions,
};

module.exports = transactionController;
