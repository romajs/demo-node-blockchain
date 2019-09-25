const nodeService = require('../services/nodeService');

const addNode = async (ctx) => {
  // TODO: validate node schema
  const { url } = ctx.request.body;
  const node = await nodeService.addNode(url);
  ctx.body = { id: node.id };
};

const listNodes = async (ctx) => {
  const nodes = await nodeService.listNodes();
  ctx.body = nodes.map((node) => node.toJSON());
};

const nodeController = {
  addNode,
  listNodes,
};

module.exports = nodeController;
