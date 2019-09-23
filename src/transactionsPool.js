const transactions = [];

module.exports = {
  add: (tx) => transactions.push(tx),
  get: () => Object.assign([], transactions),
  size: () => transactions.length,
  next: () => transactions.length > 1 ? transactions[0] : null,
};
