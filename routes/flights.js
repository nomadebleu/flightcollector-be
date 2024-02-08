require('../models/connection');
var express = require('express');
var router = express.Router();
const Flight = require('../models/flights');

//POST pour enregistrer un flight
router.post('/', async (req, res) => {
  try {
    const {
      numeroReservation,
      planes,
      departure,
      arrival,
      services,
    } = req.body;

    //Déstructure le Sous Document

    const { nbrePlaces, movies, meals } = services;

    const newFlight = new Flight({
      numeroReservation,
      planes,
      departure,
      arrival,
      airport,
      arrivalPlace,
      departurePlace,
      iataArrival,
      iataDep,
      services: {
        nbrePlaces,
        movies,
        meals,
      },
    });

    const response = await newFlight.save();
    res.json({ result: 'New flight in db' });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du Flight dans la db" });
  }
});

//GET /places pour récuperer tout les flights
router.get('/places', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des vols" });
  }
});

//GET /pour récupérer les planes
router.get('/planes', async (req, res) => {
  try {
    // Récupérer tous les vols depuis la base de données
    const flights = await Flight.find();

    // Récupérer les ID des avions à partir de chaque vol
    const planeIds = flights.map(flight => flight.planes).flat();

    // Renvoyer les ID des avions récupérés
    res.json(planeIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des avions" });
  }
}); 


//Route /Get pour récupérer les iatas : 
router.get('/iata', async (req, res) => {
  try {
    // la méthode distinct de Mongoose pour récupérer les codes IATA uniques
    const iataDepartures = await Flight.distinct('iataDep');
    const iataArrivals = await Flight.distinct('iataArrival');

    // Réponse avec les codes IATA récupérés
    res.json({ departures: iataDepartures, arrivals: iataArrivals });
  } catch (error) {
    // En cas d'erreur, renvoyez une réponse d'erreur avec le code d'erreur approprié
    console.error('Erreur lors de la récupération des codes IATA :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des codes IATA' });
  }
});


module.exports = router;