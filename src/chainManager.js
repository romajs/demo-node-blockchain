const fs = require('fs');
const path = require('path');
const util = require('util');
const blockchain = require('./blockchain');

const CHAIN_FILE_NAME = path.join(__dirname, '../chain.json');

const fileStat = util.promisify(fs.stat);
const fileWrite = util.promisify(fs.writeFile);
const fileOpen = util.promisify(fs.open);
const fileRead = util.promisify(fs.readFile);

const toJSON = JSON.stringify;
const fromJSON = JSON.parse;

const getFile = () => fileStat(CHAIN_FILE_NAME)
  .then(() => fileOpen(CHAIN_FILE_NAME))
  .catch((err) => {
    if (err.code === 'ENOENT') {
      return fileWrite(CHAIN_FILE_NAME, toJSON([]));
    }
  });

const getChain = () => getFile().then(fileRead).then(fromJSON);

getChain().then(chain => {
  if (chain.length === 0) {
    const newChain = blockchain.generateGenesisBlock();
    return fileWrite(CHAIN_FILE_NAME, toJSON(newChain));
  }
});
