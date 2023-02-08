/* This is a Node.js script that creates an HTTP server. The server listens on a port and uses the Express application in the ./app module as the request handler. The port number to listen on is either specified in the PORT environment variable, or if it's not set, the default is 3000.

The normalizePort function takes a value and returns a port number if the input is a valid number, or the input itself if it's not a number.

The error handler function, errorHandler, handles different error codes that could occur when the server starts listening, such as 'EACCES' (permission denied) or 'EADDRINUSE' (address already in use). In those cases, the server will log an error message and terminate.

Finally, the server starts listening on the specified port. The 'listening' event is logged to the console when the server is ready to receive incoming requests.

*/





const http = require('http'); //utilisation de http pour transférer des données 
const app = require('./app'); 

NormalizePort = val => { 
  const port = parseInt(val, 10);
  
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.listen(port, () => console.log(`Server listening on port ${port}...`));
app.set ('port', port);


const errorHandler = error => { 
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
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
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

