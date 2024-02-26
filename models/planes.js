const mongoose = require("mongoose");

//Schéma de Planes
const planeSchema = mongoose.Schema({
  type: String,
  picture: String,
  compagnie: String,
  immatriculation: String,
  age: Number,
  description: String,
  seatMap: String,
  isFavorite: Boolean,
});

//Model de Planes
const Plane = mongoose.model("planes", planeSchema);

module.exports = Plane;
