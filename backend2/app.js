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

const sauceRoutes = require('./routes/sauce').default; 
const userRoutes  = require('./routes/user').default;

app.use(helmet());




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//accepted verbs methods
  next();
});


app.use(express.json()); 
app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes);

const limiter = rateLimit({ windowMs: 60 * 1000, max: 3 });
app.use(limiter);
app.use(sanitize()); // https://javascript.plainenglish.io/how-to-sanitize-your-express-app-against-mongodb-injection-cross-site-scripting-6a22f4e822aa
app.use(sanitize({
  replaceWith: '_' }))


module.exports = app;
module.exports = router
