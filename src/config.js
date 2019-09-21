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
      arg: 'host',
    },
    port: {
      format: 'port',
      default: 8000,
      env: 'PORT',
      arg: 'port',
    },
    rootBasePath: {
      format: String,
      default: '/',
      env: 'ROOT_BASE_PATH',
      arg: 'root-base-path',
    },
  },
  logger: {
    level: {
      format: String,
      default: 'debug',
      env: 'LOGGER_LEVEL',
      arg: 'logger-level',
    },
    prettyPrint: {
      format: Boolean,
      default: true,
      env: 'LOGGER_PRETTY_PRINT',
      arg: 'logger-pretty-print',
    },
    useLevelLabels: {
      format: Boolean,
      default: true,
      env: 'LOGGER_LABELS',
      arg: 'logger-labels',
    },
  },
});

config.validate({ allowed: 'strict' });

module.exports = config;
