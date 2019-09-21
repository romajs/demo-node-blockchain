const config = require('./config');
const io = require('socket.io-client');
const logger = require('./logger');
const uuid = require('uuid');
const blockchain = require('./blockchain');
const chainManager = require('./chainManager');

const serverUrl = `http://${config.get('http.host')}:${config.get('http.port')}`;
const socket = io(serverUrl);

const minerId = uuid.v4();
logger.info('Miner:', minerId);

socket.on('transaction', async transaction => {
  logger.info('Received transaction:', transaction);
  const previousHash = await chainManager.getLatestHash();
  const block = blockchain.forgeBlock(transaction, previousHash);
  logger.info('Forged block:', block);
  socket.emit('forge-block', minerId, block);
});
