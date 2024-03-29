const mongoose = require('mongoose');

//Schéma de Users
const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  mail: String,
  token: String,
  pictureProfil: String,
  password: String,
  totalPoints: Number,
  badges:[{ type: mongoose.Schema.Types.ObjectId, ref: 'badges' }],
  flights:[{ type: mongoose.Schema.Types.ObjectId, ref: 'flights' }],
  planes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'planes' }],
  isConnected:Boolean,
});

//Model de Users
const User = mongoose.model('users', userSchema);

module.exports = User;