const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const path = require('path');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use((cors()));
require ('dotenv').config();

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, MONGO_DB } = process.env;
const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))   
  .catch(err => console.error('Could not connect to MongoDB...', err));


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

app.use(helmet());

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

const limiter = rateLimit({ windowMs: 60 * 1000, max: 3 });
app.use(limiter);
app.use(sanitize());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));

module.exports = app;
module.exports = router;
