const pino = require('pino');

const config = require('./config');

const logger = pino(config.get('logger'));

module.exports = logger;
