const SHA256 = require('crypto-js/sha256');

function calculateHash ({ previousHash, timestamp, data, nonce = 1 }) {
  return SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
}

function generateGenesisBlock () {
  const block = {
    timestamp: Date.now(),
    data: 'Genesis Block',
    previousHash: '0',
  };
  return {
    ...block,
    hash: calculateHash(block),
  };
}

function checkDifficulty (difficulty, hash) {
  return hash.substr(0, difficulty) === '0'.repeat(difficulty);
}

function updateHash (block) {
  return { ...block, hash: calculateHash(block) };
}

function nextNonce (block) {
  return updateHash({ ...block, nonce: block.nonce + 1 });
}

function trampoline (func) {
  let result = func.apply(func, ...arguments);
  while (result && typeof (result) === 'function') {
    result = result();
  }
  return result;
}

function mineBlock (difficulty, block) {
  function mine (block) {
    const newBlock = nextNonce(block);
    return checkDifficulty(difficulty, newBlock.hash)
      ? newBlock
      : () => mine(nextNonce(block));
  }
  return trampoline(mine(nextNonce(block)));
}

function forgeBlock (data, previousHash) {
  const block = { data, previousHash, nonce: 0, timestamp: Date.now() };
  return mineBlock(4, block);
}

function validateChain (chain) {
  function tce (chain, index) {
    if (index === 0) return true;
    const { hash, ...currentBlockWithoutHash } = chain[index];
    const currentBlock = chain[index];
    const previousBlock = chain[index - 1];
    const isValidHash = (hash === calculateHash(currentBlockWithoutHash));
    const isPreviousHashValid = (currentBlock.previousHash === previousBlock.hash);
    const isValidChain = (isValidHash && isPreviousHashValid);

    if (!isValidChain) return false;
    else return tce(chain, index - 1);
  }
  return tce(chain, chain.length - 1);
}

module.exports = {
  generateGenesisBlock,
  forgeBlock,
  validateChain,
};
