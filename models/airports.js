const mongoose = require('mongoose');

//Schéma de Flag
const airportSchema = mongoose.Schema({
  country : String,
  city : String,
  name : String,
  flag : String
});

//Model de Flag
const Airport = mongoose.model('airports', airportSchema);

module.exports = Airport;