const mongoose = require("mongoose");

//Schéma de Flights
const flightSchema = mongoose.Schema({
  reservationNumber: String,

  planes: { type: mongoose.Schema.Types.ObjectId, ref: "planes" },

  departure: Date,
  departureScheduled: Date,
  departureEstimated: Date,
  departureActual: Date,

  arrival: Date,
  arrivalScheduled: Date,
  arrivalEstimated: Date,

  airportNameDest: String,

  iataArrival: String,
  iataDep: String,

  nbrePlaces: Number,
  meals: String,
});

//Model de Flights
const Flight = mongoose.model("flights", flightSchema);

module.exports = Flight;
