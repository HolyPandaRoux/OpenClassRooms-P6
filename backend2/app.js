const express = require('express');
const mongoose = require('mongoose');
const app = express();
const sauce = require('./routes/sauce');
const user = require('./routes/user');
const path = require('path');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

/* Getting the values from the .env file. */
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP } = process.env;
console.log(`MONGO_USER: ${MONGO_USER}`);
console.log(`MONGO_PASSWORD: ${MONGO_PASSWORD}`);
console.log(`MONGO_IP: ${MONGO_IP}`);

/* Creating a connection string to the MongoDB Atlas cluster. */
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}?retryWrites=true&w=majority`;

/* Connecting to the MongoDB Atlas cluster. */
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// DDoS protection - limit the number of requests from a single IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
/* A security measure to prevent cross-site scripting attacks. */
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
/* Parsing the body of the request. */
app.use(express.urlencoded({ extended: true }));
/* Serving the images folder. */
app.use('/images', express.static(path.join(__dirname, 'images')));
/* A security measure to prevent cross-site scripting attacks. */
app.use(sanitize());
app.use(limiter);

/* Telling the server to use the routes defined in the sauce.js and user.js files. */
app.use('/api/sauces', sauce);
app.use('/api/auth', user);

module.exports = app;
