const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const router = express.Router();
app.use('/api', router);

// Cache port validation
let cachedPort;
const normalizePort = (val) => {
  cachedPort = cachedPort || parseInt(val, 10);
  if (isNaN(cachedPort)) {
    return val;
  }
  if (cachedPort >= 0) {
    return cachedPort;
  }
  return false;
};

// Split into separate function
const setupPort = () => {
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
}

// Split into separate function
const handleError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Split into separate function
const setupListener = () => {
  const server = http.createServer(app);

  server.on('error', handleError);
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
    console.log('Listening on ' + bind);
  });

  server.listen(port, () => {
    console.log(`Server launched on port ${port}...`);
  });
}

setupPort();
handleError();
setupListener();
