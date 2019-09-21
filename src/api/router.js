const Router = require('koa-router');

const router = new Router({ prefix: '/api' });

router.get('/health', (ctx) => {
  ctx.body = { status: 'UP' };
});

module.exports = router;
