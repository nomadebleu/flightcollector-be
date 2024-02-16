const Airport = require('../models/airports');
var express = require('express');
var router = express.Router();

//Création d'un nouveau airport en DB : 

// Route POST pour créer un nouvel aéroport
router.post('/newAirport', async (req, res) => {
  try {
    // Récupérer les données de l'aéroport à partir du corps de la requête
    const { country, city, name, flag } = req.body;

    // Créer un nouvel aéroport
    const newAirport = new Airport({
      country,
      city,
      name,
      flag
    });

    // Enregistrer l'aéroport dans la base de données
    const savedAirport = await newAirport.save();

    // Envoyer la réponse avec l'aéroport créé
    res.status(201).json(savedAirport);
  } catch (error) {
    // Gérer les erreurs
    console.error('Error creating airport:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  

router.get('/getFlagByArrivalPlace', async (req, res) => {
  try {
    const { arrivalPlace } = req.body;
    
    // Recherche de l'aéroport en fonction du lieu d'arrivée de l'utilisateur
    const airport = await Airport.findOne({ country: arrivalPlace });

    if (!airport) {
      return res.status(404).json({ error: "Aéroport non trouvé pour le lieu d'arrivée spécifié." });
    }

    // Extrait du drapeau de l'aéroport trouvé
    const flag = airport.flag;

    // Renvoie le drapeau à l'utilisateur
    res.status(200).json({ flag });
  } catch (error) {
    console.error('Erreur lors de la récupération du drapeau:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



  module.exports = router;