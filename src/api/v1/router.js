const chainManager = require('../../chainManager');
const Router = require('koa-router');
const nodeController = require('../../controllers/nodeController');
const transactionController = require('../../controllers/transactionController');

const router = new Router({ prefix: '/api/v1' });

router.get('/chain', (ctx) => {
  return chainManager.getChain()
    .then((chain) => { ctx.body = chain; });
});

router.get('/nodes', nodeController.listNodes);
router.post('/nodes', nodeController.addNode);
router.get('/transactions', transactionController.listTransactions);
router.post('/transactions', transactionController.addTransaction);

module.exports = router;
