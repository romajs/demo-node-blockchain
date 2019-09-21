const Router = require('koa-router');
const socket = require('../../socket');

const router = new Router({ prefix: '/api/v1' });

router.get('/transactions', (ctx) => {
  const transaction = {
    sender: 'ks829fh28192j28d9dk9',
    receiver: 'ads8d91w29jsm2822910',
    amount: 0.0023,
    currency: 'BTC',
  };
  socket.io.emit('transaction', transaction);
  ctx.body = [];
});

module.exports = router;
