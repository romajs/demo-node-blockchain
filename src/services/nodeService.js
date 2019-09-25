const EventTypes = require('../models/EventTypes');
const Node = require('../models/Node');
const nodeRepository = require('../repository/nodeRepository');
const socketIOServer = require('../socket-io-server');

const propagateClientEventsToServer = (clientIO, serverIO) => {
  clientIO.on(EventTypes.TRANSACTION_ADD, (amount, receiver, sender) => {
    serverIO.emit(EventTypes.TRANSACTION_ADD, amount, receiver, sender);
  });
  clientIO.on(EventTypes.MINE_START, (transaction) => {
    serverIO.emit(EventTypes.MINE_START, transaction);
  });
  clientIO.on(EventTypes.MINE_STOP, (block) => {
    serverIO.emit(EventTypes.MINE_STOP, block);
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
