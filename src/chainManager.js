const fs = require('fs');
const path = require('path');
const util = require('util');
const blockchain = require('./blockchain');

const CHAIN_FILE_NAME = path.join(__dirname, '../chain.json');

const fileStat = util.promisify(fs.stat);
const fileWrite = util.promisify(fs.writeFile);
const fileOpen = util.promisify(fs.open);
const fileRead = util.promisify(fs.readFile);

const toJSON = (object) => JSON.stringify(object, null, 2);
const fromJSON = JSON.parse;

const getFile = () => fileStat(CHAIN_FILE_NAME)
  .then(() => fileOpen(CHAIN_FILE_NAME))
  .catch((err) => {
    if (err.code === 'ENOENT') {
      const chain = [blockchain.generateGenesisBlock()];
      return fileWrite(CHAIN_FILE_NAME, toJSON(chain));
    }
  });

// FIXME:
const rootChain = [
  {
    timestamp: 1569292497300,
    data: 'Genesis Block',
    previousHash: '0',
    hash: '10ba85489847135f3d7cd82bbe20494aa5809f7b10563ff8d5c0c378ec2e40e9',
  },
];

const getChain = () => Promise.resolve(rootChain);

const getLatestBlock = () => getChain().then((chain) => chain[chain.length - 1]);

const getLatestHash = () => getLatestBlock().then((block) => block.hash);

const appendBlock = (block) => getChain()
  .then((chain) => chain.concat(block))
  .then((newChain) => {
    if (blockchain.validateChain(newChain)) {
      rootChain.push(block);
      return Promise.resolve(rootChain);
    }
    return Promise.reject(rootChain);
  });
  // .then((chain) => fileWrite(CHAIN_FILE_NAME, toJSON(chain)));

module.exports = {
  getChain,
  getLatestHash,
  appendBlock,
};
