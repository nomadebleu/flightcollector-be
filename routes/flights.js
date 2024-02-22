require("dotenv").config();
require("../models/connection");
var express = require("express");
var router = express.Router();
const Flight = require("../models/flights");

const apiKeyMovies = process.env.API_KEY_MOVIES;
const apiKeyFlight = process.env.API_KEY_FLIGHTS;

//POST pour enregistrer un flight OK
router.post("/", async (req, res) => {
  try {
    const {
      reservationNumber,
      planes,
      departure,
      departureScheduled,
      departureEstimated,
      departureActual,
      arrival,
      arrivalScheduled,
      arrivalEstimated,
      airportNameDest,
      iataArrival,
      iataDep,
      nbrePlaces,
      meal,
    } = req.body;

    const newFlight = new Flight({
      reservationNumber,
      planes,
      departure,
      departureScheduled,
      departureEstimated,
      departureActual,
      arrival,
      arrivalScheduled,
      arrivalEstimated,
      airportNameDest,
      iataArrival,
      iataDep,
      nbrePlaces,
      meal,
    });

    const response = await newFlight.save();
    res.json({ result: "New flight in db" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du Flight dans la db" });
  }
});

//Pour avoir des films
router.get("/movies", (req, res) => {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKeyMovies}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data.results.length);
      res.json({ movies: data.results.sort(() => Math.random() - 0.5) });
    });
});

module.exports = router;
