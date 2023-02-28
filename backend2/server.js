const http = require('http');
const app = require ('./app');

let cachedPort;

/**
 * If the port is a number, return the port, otherwise return false.
 * @param val - The value to parse.
 * @returns The port number or the string value of the port number.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
/**
 * If the environment variable PORT is set, use that, otherwise use 3000.
 */
const setupPort = () => {
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
};
setupPort();

/**
 * If the error code is EACCES, then the port requires elevated privileges. If the error code is
 * EADDRINUSE, then the port is already in use. Otherwise, just log the error
 * @param error - The error object that was thrown.
 * @param port - The port number to use.
 */
const handleError = (error, port) => {
  if (error.code === 'EACCES') {
    console.error(`Port ${port} requires elevated privileges.`);
  } else if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error(error);
  }
  process.exit(1);
};

/**
 * The function creates a server, sets up error handling, and then starts the server.
 */
const setupListener = () => {
  const server = http.createServer(app);
    server.on('error', (error) => {
    handleError(error, app.get('port'));
    });
    server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
    console.log('Listening on ' + bind);
    });
    server.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}...`);
    });
};

setupListener();
