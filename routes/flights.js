require("dotenv").config();
require("../models/connection");
var express = require("express");
var router = express.Router();
const Flight = require("../models/flights");
const Airport = require("../models/airports");

const apiKeyMovies = process.env.API_KEY_MOVIES;

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
      airportDep,
      airportArr,
      nbrePlaces,
      meals,
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
      airportDep,
      airportArr,
      nbrePlaces,
      meals,
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

//Pour avoir des films OK
router.get("/movies", (req, res) => {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKeyMovies}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data.results.length);
      res.json({ movies: data.results.sort(() => Math.random() - 0.5) });
    });
});

//Pour récupérer tous les flights 
router.get('/allFlights',async(req,res) => {
  try {
    const flights = await Flight.find();
    res.json({ result: true, data: flights });
  } catch (error) {
    // En cas d'erreur, réponse d'erreur avec le code d'erreur approprié
    console.error("Erreur lors de la récupération des flights:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des flights" });
  }

})
//Pour récupérer un vol avec le numéro de réservation OK
router.get('/:reservationNumber', async (req, res) => {
  try {
    const reservationNumber = req.params.reservationNumber;
    const flight = await Flight
                            .findOne({ reservationNumber })
                            .populate('planes')
                            .populate('airportDep','iataCode')
                            .populate('airportArr','iataCode');

    if (!flight) {
      return res.status(404).json({ error: 'Aucun vol trouvé avec ce numéro de réservation.' });
    }

    res.json({ result: true, data: flight });
  } catch (error) {
    console.error('Erreur lors de la récupération du vol:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du vol.' });
  }
});

//Pour récupérer les lat et long du flight OK
router.get('/map/:iataCode', async (req, res) => {
  try {
    const iataCode = req.params.iataCode;
    const locMap = await Airport
                            .findOne({ iataCode })
                          
    if (!locMap) {
      return res.status(404).json({ error: 'Aucun code iata trouvé.' });
    }

    res.json({ result: true, data:locMap});
  } catch (error) {
    console.error('Erreur lors de la récupération du iata:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du iata.' });
  }
});
//Pour ajouter les points du flight au flight OK
router.put('/points', async (req, res) => {
  try {
    const { flightId, pointsFlight } = req.body;
    const data = await Flight.findById(flightId);

    data.points += pointsFlight;
    await data.save();

    res.json({ result: true, message:'Points du Flight updated'});
  } catch (error) {
    console.error('Erreur lors du update:', error);
    res.status(500).json({ error: 'Erreur lors de la MAJ' });
  }
});


module.exports = router;
