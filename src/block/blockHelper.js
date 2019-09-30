const SHA256 = require('crypto-js/sha256');

const calculateHash = ({ data, previousHash, timestamp, nonce = 1 }) => {
  return SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
};

const generateBlock = (data, previousHash) => {
  const block = { data, nonce: 0, previousHash, timestamp: Date.now() };
  return { ...block, hash: calculateHash(block) };
};

const generateGenesisBlock = () => {
  const block = { data: { text: 'Genesis Block' }, previousHash: '0', timestamp: Date.now() };
  return { ...block, hash: calculateHash(block) };
};

const blockManager = {
  calculateHash,
  generateBlock,
  generateGenesisBlock,
};

module.exports = blockManager;
