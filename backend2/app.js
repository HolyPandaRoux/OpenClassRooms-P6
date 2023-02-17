const express   = require('express');
const mongoose  = require('mongoose');
const app       = express();
const sauce     = require('./routes/sauce');
const user      = require('./routes/user');
const path      = require('path');
const sanitize  = require('express-mongo-sanitize');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const cors      = require('cors');
const limiter   = rateLimit({ windowMs: 60 * 1000, max: 3 });
const router = express.Router();
app.use('/api', router);
app.use(cors());

require('dotenv').config();

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_DB } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()   => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use ('/api/sauces', sauce);
app.use ('/api/auth', user);
app.use ('/login ', user);
app.use ('/signup', user);

app.use(helmet());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(limiter);
app.use(sanitize());

module.exports = app;


