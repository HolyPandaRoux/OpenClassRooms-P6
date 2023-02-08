const express     = require('express');
const mongoose    = require('mongoose');
const app         = express();
const path        = require('path');
const sanitize    = require('express-mongo-sanitize');
const rateLimit   = require('express-rate-limit');
const dotenv      = require('dotenv');
const userRoutes  = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');



dotenv.config();


mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion to mongoDB established'))
  .catch(console.error);

app.use (cors( {origin: '*'}));

// WebSocket connection to 'ws://localhost:4200/ws' failed: Error during WebSocket handshake: Unexpected response code: 404

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.urlencoded({ extended: true })); // bodyparser is deprecated in express 4.16.0
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(helmet(helmet()));
const limiter = rateLimit({ windowMs: 60 * 1000, max: 3 });
app.use(limiter);
app.use(sanitize());
app.use(sanitize ({
  replaceWith: '_'
  }));


app.use('/api/sauces', require('./routes/sauce'));
app.use('/api/auth', require('./routes/user'));
app.listen(3000, () => console.log('Server started on port 3000'));


module.exports = app;

