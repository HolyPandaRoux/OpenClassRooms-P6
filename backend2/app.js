/*
This code sets up an ExpressJS based web server and connects it to a MongoDB database using Mongoose. Some key features include:

Connection to MongoDB: The code connects to a MongoDB database using the Mongoose library. The database URL is stored in the process.env.DB_CONNECT environment variable.


Routing: The code sets up two routes for the application, one for sauces and one for authentication. These routes are imported from the ./routes/sauce and ./routes/user files respectively.


Middleware: The code uses several middleware functions, including helmet for security, express.json to parse incoming JSON data, express.static to serve static files, and express-rate-limit to limit the number of requests to the API. Additionally, it sets up a middleware function to set the Access-Control-Allow-Origin header.


Port: The code starts the ExpressJS server on port 3000 or a port specified in the process.env.PORT environment variable.


Error handling and sanitization: The code uses express-mongo-sanitize to sanitize incoming data to prevent MongoDB injection and cross-site scripting attacks. The sanitizer replaces any potentially harmful characters with an underscore.

*/

require('dotenv').config();
const express       = require('express');
const mongoose      = require('mongoose');
const app           = express();
const path          = require('path'); 
const sanitize      = require('express-mongo-sanitize');
const helmet        = require('helmet'); 
const rateLimit     = require('express-rate-limit'); 

mongoose.connect (process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
.then(() => console.log('Connexion to mongoDB established'))
.catch(() => console.log('acces denied'));

require('dotenv').config({path:'.env'}); 

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.preflightContinue = true;
  next();
});

const sauceRoutes = require('./routes/sauce'); 
const userRoutes  = require('./routes/user');

app.use(helmet());

app.use(express.json()); 
app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('./api/sauces', sauceRoutes); 
app.use('./api/auth', userRoutes);

const limiter = rateLimit({ windowMs: 60 * 1000, max: 3 });
app.use(limiter);
app.use(sanitize()); // https://javascript.plainenglish.io/how-to-sanitize-your-express-app-against-mongodb-injection-cross-site-scripting-6a22f4e822aa
app.use(sanitize({
  replaceWith: '_' }))

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}...`));
  
module.exports = app;
