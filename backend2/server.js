const http = require('http');
const app = require ('./app');

let cachedPort;

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

const setupPort = () => {
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
};
setupPort();

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
