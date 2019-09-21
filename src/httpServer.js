const app = require('./app');
const config = require('./config');
const logger = require('./logger');

let httpServer = null;

const start = () => new Promise((resolve, reject) => {
  try {
    const [port, host] = [config.get('http.port'), config.get('http.host')];
    httpServer = app.listen(port, host, () => {
      logger.info('Http server started on:', httpServer.address());
      resolve();
    });
  } catch (err) {
    reject(err);
  }
});

const stop = () => httpServer.close();

module.exports = {
  start,
  stop,
};
