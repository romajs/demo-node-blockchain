const SocketEventTypes = require('../models/SocketEventTypes');
const Node = require('../models/Node');
const nodeRepository = require('../repository/nodeRepository');
const socketIOServer = require('../socket-io-server');

const propagateClientEventsToServer = (clientIO, serverIO) => {
  clientIO.on(SocketEventTypes.TRANSACTION_ADD, (amount, receiver, sender) => {
    serverIO.emit(SocketEventTypes.TRANSACTION_ADD, amount, receiver, sender);
  });
  clientIO.on(SocketEventTypes.MINER_START, (transaction) => {
    serverIO.emit(SocketEventTypes.MINER_START, transaction);
  });
  clientIO.on(SocketEventTypes.MINER_STOP, (block) => {
    serverIO.emit(SocketEventTypes.MINER_STOP, block);
  });
};

const addNode = async (url) => {
  const node = new Node(url);
  propagateClientEventsToServer(await node.connect(), socketIOServer.io);
  nodeRepository.addNode(node);
  return node;
};

const listNodes = () => {
  return Promise.resolve(nodeRepository.listNodes());
};

const nodeService = {
  addNode,
  listNodes,
};

module.exports = nodeService;
