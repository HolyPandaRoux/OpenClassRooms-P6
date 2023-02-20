/* It imports the http module to create a HTTP server.
It imports the app module, which is an instance of an Express application.
It imports the cors middleware and applies it to the Express app.
It defines a function normalizePort that tries to parse a string into a number.
It defines a function setupPort that sets the app's port based on the environment variable process.env.PORT.
It defines a function handleError that handles any errors that occur when trying to start the server.
It calls setupPort to set up the port.
It defines a function setupListener that creates a HTTP server using the Express app, sets up event listeners for errors and listening events, and starts the server.
It calls setupListener to start the server.
*/




const http = require('http');
const app = require ('./app');
const cors = require('cors');

app.use(cors());

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

const setupPort = () => {
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
};

const handleError = (error, port) => {
  if (error.code === 'EACCES') {
    console.error(`Port ${port} requires elevated privileges.`);
    process.exit(1);
  } else if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
    process.exit(1);
  } else {
    console.error(error);
    process.exit(1);
  }
};

setupPort();

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
