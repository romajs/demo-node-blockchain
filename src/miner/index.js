const { fork } = require('child_process');
const config = require('../config');
const io = require('socket.io-client');
const logger = require('../logger');
const path = require('path');
const uuid = require('uuid');

const CHILD_NAME = path.join(__dirname, 'child.js');

const serverUrl = `http://${config.get('http.host')}:${config.get('http.port')}`;
const socket = io(serverUrl);

const minerId = uuid.v4();
logger.info('Miner:', minerId);

let child = null;

socket.on('transaction', async transaction => {
  logger.info('Received transaction:', transaction);
  if (child && !child.killed) {
    logger.info('Killing previous child process:', child.pid);
    child.kill();
  }
  child = fork(CHILD_NAME);
  child.on('message', (block) => {
    logger.info('Forged block:', block);
    socket.emit('forge-block', minerId, block);
  });
  child.send({ transaction });
});
