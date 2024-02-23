var express = require("express");
var router = express.Router();
const Airport = require("../models/airports");
const Flight = require('../models/flights');
const User = require('../models/users')

// Route POST pour créer un nouvel aéroport OK
router.post('/', async (req, res) => {
  try {
    // Récupérer les données de l'aéroport à partir du corps de la requête
    const { country, city, name, flag,iataCode,latitude,longitude } = req.body;

    // Créer un nouvel aéroport
    const newAirport = new Airport({
      country,
      city,
      name,
      flag,
      iataCode,
      latitude,
      longitude,
    });

    // Enregistrer l'aéroport dans la base de données
    const savedAirport = await newAirport.save();

    // Envoyer la réponse avec l'aéroport créé
    res.json({result: true, data:savedAirport});
  } catch (error) {
    // Gérer les erreurs
    console.error("Error creating airport:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/getFlagByArrivalPlace", async (req, res) => {
  try {
    const { airportNameDest } = req.body;
    
    // Recherche de l'aéroport en fonction du lieu d'arrivée de l'utilisateur
    const airport = await Airport.findOne({ name: airportNameDest });

    if (!airport) {
      return res.status(404).json({
        error: "Aéroport non trouvé pour le lieu d'arrivée spécifié.",
      });
    }

    // Extrait du drapeau de l'aéroport trouvé
    const flag = airport.flag;

    // Renvoie le drapeau à l'utilisateur
    res.status(200).json({ flag });
  } catch (error) {
    console.error("Erreur lors de la récupération du drapeau:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});



//TEST ROUTE 
router.post("/getUserFlightAirports", async (req, res) => {
  try {
    const userId = req.body.userId; 
    const flightId = req.body.flightId;

    // Récupérer l'utilisateur avec son ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    // Récupérer les vols de l'utilisateur avec les détails de l'aéroport de départ et d'arrivée
    const userFlights = await User.findById(userId).populate('flights');
    
    
    if (!userFlights) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    // Recherche du vol spécifique parmi les vols de l'utilisateur
    const flight = userFlights.flights.find(flight => flight._id.equals(flightId));
    
    if (!flight) {
      return res.status(404).json({ error: "Vol non trouvé pour cet utilisateur" });
    }
    
    // Récupération des détails des aéroports associés au vol spécifique
    const flightWithAirports = await Flight.findById(flight._id)
      .populate('airportDep')
      .populate('airportArr');
    
    if (!flightWithAirports) {
      return res.status(404).json({ error: "Détails du vol non trouvés" });
    }else{

    res.json({ flightWithAirports: flightWithAirports });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des vols de l'utilisateur" });
  }
});




module.exports = router;
