const Router = require('koa-router');

const chainManager = require('../chain/chainManager');
const nodeController = require('../controllers/nodeController');
const transactionController = require('../controllers/transactionController');

const router = new Router({ prefix: '/api' });

router.get('/health', (ctx) => { ctx.body = { status: 'UP' }; });

router.get('/chain', (ctx) => {
  chainManager.getChain().then((chain) => { ctx.body = chain; });
});

router.get('/nodes', nodeController.listNodes);
router.post('/nodes', nodeController.addNode);
router.get('/transactions', transactionController.listTransactions);
router.post('/transactions', transactionController.addTransaction);

module.exports = router;

module.exports = router;
