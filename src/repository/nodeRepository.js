const nodes = [];

const addNode = (node) => nodes.push(node);

const listNodes = () => Object.assign([], nodes);

const nodeRepository = {
  addNode,
  listNodes,
};

module.exports = nodeRepository;
