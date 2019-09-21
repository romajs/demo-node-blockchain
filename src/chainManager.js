const fs = require('fs');
const path = require('path');
const util = require('util');
const blockchain = require('./blockchain');

const CHAIN_FILE_NAME = path.join(__dirname, '../chain.json');

const fileStat = util.promisify(fs.stat);
const fileWrite = util.promisify(fs.writeFile);
const fileOpen = util.promisify(fs.open);
const fileRead = util.promisify(fs.readFile);

const toJSON = object => JSON.stringify(object, null, 2);
const fromJSON = JSON.parse;

const getFile = () => fileStat(CHAIN_FILE_NAME)
  .then(() => fileOpen(CHAIN_FILE_NAME))
  .catch((err) => {
    if (err.code === 'ENOENT') {
      return fileWrite(CHAIN_FILE_NAME, toJSON([]));
    }
  });

const getChain = () => getFile().then(fileRead).then(fromJSON);

const getLatestBlock = () => getChain().then(chain => chain[chain.length - 1]);

const getLatestHash = () => getLatestBlock().then(block => block.hash);

getChain().then(chain => {
  if (chain.length === 0) {
    const newChain = [blockchain.generateGenesisBlock()];
    return fileWrite(CHAIN_FILE_NAME, toJSON(newChain));
  }
});

const appendBlock = (block) => getChain()
  .then(chain => chain.concat(block))
  .then(chain => {
    if (blockchain.validateChain(chain)) {
      return Promise.resolve(chain);
    }
    return Promise.reject(chain);
  })
  .then(chain => fileWrite(CHAIN_FILE_NAME, toJSON(chain)));

module.exports = {
  getChain,
  getLatestHash,
  appendBlock,
};
