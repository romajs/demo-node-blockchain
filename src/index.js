const blockchain = require('./blockchain');

const chain = [blockchain.generateGenesisBlock()];

const newBlockData = {
  sender: 'ks829fh28192j28d9dk9',
  receiver: 'ads8d91w29jsm2822910',
  amount: 0.0023,
  currency: 'BTC',
};

const newChain = blockchain.addBlock(chain, newBlockData);

console.log('newChain:', newChain);

console.log('isValid:', blockchain.validateChain(chain));
