require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to MongoDB established'))
  .catch(() => console.log('Access denied'));

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
