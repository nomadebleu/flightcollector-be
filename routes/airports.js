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
  
  module.exports = router;