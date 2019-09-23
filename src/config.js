const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

const config = convict({
  env: {
    format: ['development', 'production', 'test'],
    env: 'NODE_ENV',
  },
  http: {
    host: {
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'HOST',
    },
    port: {
      format: 'port',
      default: 8000,
      env: 'HTTP_PORT',
      arg: 'http-port,',
    },
  },
  logger: {
    level: {
      format: String,
      default: 'debug',
      env: 'LOGGER_LEVEL',
    },
    prettyPrint: {
      format: Boolean,
      default: true,
      env: 'LOGGER_PRETTY_PRINT',
    },
    useLevelLabels: {
      format: Boolean,
      default: true,
      env: 'LOGGER_LABELS',
    },
  },
});

config.validate({ allowed: 'strict' });

module.exports = config;
