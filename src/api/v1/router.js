const EventTypes = require('../../models/EventTypes');
const Router = require('koa-router');
// const socketIOClient = require('../../socket-io-client');
const socketIOServer = require('../../socket-io-server');
const Transaction = require('../../models/Transaction');
const transactionsPool = require('../../transactionsPool');

const router = new Router({ prefix: '/api/v1' });

router.get('/transactions', (ctx) => {
  ctx.body = transactionsPool.get();
});

router.post('/transactions', (ctx) => {
  // TODO: validate transaction schema
  const { amount, receiver, sender } = ctx.request.body;
  const transaction = new Transaction(amount, receiver, sender);
  socketIOServer.io.emit(EventTypes.TRANSACTION_ADD, transaction);
  if (transactionsPool.size() > 1) {
    socketIOServer.io.emit(EventTypes.MINE_START, transactionsPool.next());
  }
  ctx.body = { id: transaction.id };
});

module.exports = router;
