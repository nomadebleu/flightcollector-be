const mongoose = require("mongoose");

//Schéma de Flag
const airportSchema = mongoose.Schema({
  country : String,
  city : String,
  name : String,
  flag : String,
  iataCode:String,
  latitude:Number,
  longitude:Number,
});

//Model de Flag
const Airport = mongoose.model("airports", airportSchema);

module.exports = Airport;
