const nodes = [];

const nodeRepository = {
  add: (node) => nodes.push(node),
  list: () => Object.assign([], nodes),
};

module.exports = nodeRepository;
