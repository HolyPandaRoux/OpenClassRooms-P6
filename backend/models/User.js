const mongoose         = require('mongoose');
const uniqueValidator  = require('mongoose-unique-validator');
var cors               = require('cors');
const bodyParser       = require('body-parser');
const app              = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
// user schema, username & pwd (unique email)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);