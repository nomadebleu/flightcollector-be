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
      airport,
      arrivalPlace,
      departurePlace,
      iataArrival,
      iataDep,
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






module.exports = router;