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

  airportDep: { type: mongoose.Schema.Types.ObjectId, ref: "airports" },
  airportArr: { type: mongoose.Schema.Types.ObjectId, ref: "airports" },

  nbrePlaces: Number,
  meals: String,
  points: Number,
});

//Model de Flights
const Flight = mongoose.model("flights", flightSchema);

module.exports = Flight;
