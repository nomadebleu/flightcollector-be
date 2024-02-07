const mongoose = require('mongoose');

//Définition du Sous-Document Services
const serviceSchema = mongoose.Schema({
  nbrePlaces: Number,
  movies: [String],
  meals: [String],
});

//Schéma de Flights
const flightSchema = mongoose.Schema({
  numeroReservation: String,
  planes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'planes' }],
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
