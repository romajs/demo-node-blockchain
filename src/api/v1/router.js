const Router = require('koa-router');

const router = new Router({ prefix: '/api/v1' });

router.get('/transactions', (ctx) => {
  ctx.body = [];
});

module.exports = router;
