const mongoose = require('mongoose');

//Définition du Sous-Document Services
const serviceSchema = mongoose.Schema({
  nbrePlaces: Number,
  movies: [String],
  meals: [String],
});

//Schéma de Flights
const flightSchema = mongoose.Schema({
  planes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'planes' }],
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'badges' },//une seul badge attribué ou aucun
  departure: Date,
  arrival: Date,
  airport : String,
  arrivalPlace : String, 
  departurePlace : String,
  iataArrival : String,
  iataDep : String,
  services: serviceSchema,
});

//Model de Flights
const Flight = mongoose.model('flights', flightSchema);

module.exports = Flight;
