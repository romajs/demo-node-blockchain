const blockHelper = require('../block/blockHelper');

const chain = [
  blockHelper.generateGenesisBlock(),
];

const validateChain = (chain) => {
  for (let index = 0; index < chain.length; index++) {
    if (index === 0) continue;
    const { hash, ...currentBlockWithoutHash } = chain[index];
    const currentBlock = chain[index];
    const previousBlock = chain[index - 1];
    const isValidHash = (hash === blockHelper.calculateHash(currentBlockWithoutHash));
    const isPreviousHashValid = (currentBlock.previousHash === previousBlock.hash);
    const isValidChain = (isValidHash && isPreviousHashValid);
    if (!isValidChain) return false;
  }
  return true;
};

const addBlock = (block) => new Promise((resolve, reject) => {
  if (validateChain(chain.concat(block))) {
    chain.push(block);
    return resolve(chain);
  }
  return reject(chain);
});

const getChain = () => Promise.resolve(chain);

const getLastBlock = () => Promise.resolve(chain.slice(-1).pop());

const getLastHash = () => getLastBlock().then((block) => block.hash);

module.exports = {
  addBlock,
  getChain,
  getLastBlock,
  getLastHash,
};
