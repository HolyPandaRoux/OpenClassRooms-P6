const express  = require('express');
const mongoose = require('mongoose');
const app      = express();
const path     = require('path'); 
const cors     = require('cors');


const sauceRoutes = require('./routes/sauce'); 
const userRoutes  = require('./routes/user');

require('dotenv').config({path:'.env'}); 
const helmet        = require('helmet'); 
const mongoSanitize = require('express-mongo-sanitize'); 
const rateLimit     = require('express-rate-limit'); 
const Ddos          = require('ddos');
const ddos          = new Ddos({
    burst:10, 
    limit:15, 
    testmode:false
});  
app.use(ddos.express);
app.get ('/', (req, res, next) => {
  res.json({message: 'Welcome to the API'});
});

mongoose.connect (process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
.then(() => console.log('Connexion to mongoDB established'))
.catch(() => console.log('acces denied'));  

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//accepted verbs methods
  next();
});

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes);

app.use(helmet());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 3 });
app.use(limiter);
app.use(mongoSanitize()); // https://javascript.plainenglish.io/how-to-sanitize-your-express-app-against-mongodb-injection-cross-site-scripting-6a22f4e822aa
app.use(mongoSanitize({
  replaceWith: '_' }))


module.exports = app;

