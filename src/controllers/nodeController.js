const nodeService = require('../services/nodeService');

const addNode = (ctx) => {
  const { url } = ctx.request.body;
  return nodeService.addNode(url).then((node) => {
    ctx.body = { id: node.id };
  });
};

const listNodes = (ctx) => {
  return nodeService.listNodes().then((nodes) => {
    ctx.body = nodes.map((node) => node.toJSON());
  });
};

const nodeController = {
  addNode,
  listNodes,
};

module.exports = nodeController;
