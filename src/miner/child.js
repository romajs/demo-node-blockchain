const blockchain = require('../blockchain');
const chainManager = require('../chainManager');
const logger = require('../logger');

process.on('message', async (transaction) => {
  const previousHash = await chainManager.getLatestHash();
  logger.info('Forging block from previous hash:', previousHash);
  const block = blockchain.forgeBlock(transaction, previousHash);
  process.send(block);
});
