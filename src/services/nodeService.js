const Node = require('../models/Node');
const nodeRepository = require('../repository/nodeRepository');
const socketEventsHandler = require('../socket-events-handler');

const addNode = (url) => {
  const node = new Node(url);
  return node.connect()
    .then(socketEventsHandler.handle)
    .then(() => {
      nodeRepository.add(node);
      return node.toJSON();
    });
};

const listNodes = () => {
  return Promise.resolve(nodeRepository.list());
};

const nodeService = {
  addNode,
  listNodes,
};

module.exports = nodeService;
