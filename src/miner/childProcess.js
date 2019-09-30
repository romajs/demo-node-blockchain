const blockHelper = require('../block/blockHelper');
const logger = require('../logger');

const checkDifficulty = (difficulty, hash) => {
  return hash.substr(0, difficulty) === '0'.repeat(difficulty);
};

const mineBlock = (difficulty, block) => {
  while (!checkDifficulty(difficulty, block.hash)) {
    block.nonce += 1;
    block.hash = blockHelper.calculateHash(block);
  }
  return block;
};

process.on('message', ({ transaction, previousHash }) => {
  logger.info('Mining from:', 'transaction.id:', transaction.id, 'previousHash:', previousHash);
  const block = mineBlock(4, blockHelper.generateBlock(transaction, previousHash));
  process.send(block);
});
