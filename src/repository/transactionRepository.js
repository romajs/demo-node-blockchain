const transactions = [];

const addTransaction = (tx) => transactions.push(tx);

const countTransactions = () => transactions.length;

const listTransactions = () => Object.assign([], transactions);

const nextTransaction = () => transactions.length > 1 ? transactions[0] : null;

const removeTransaction = (id) => {
  const index = transactions.find((transaction) => transaction.id === id);
  transactions.splice(index, 1);
};

const transactionRepository = {
  addTransaction,
  countTransactions,
  listTransactions,
  nextTransaction,
  removeTransaction,
};

module.exports = transactionRepository;
