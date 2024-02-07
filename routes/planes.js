require('../models/connection');
var express = require('express');
var router = express.Router();
const Plane = require('../models/planes');

//POST pour enregistrer un plane
router.post('/', async (req, res) => {
  try {
    const {
      type,
      picture,
      compagnie,
      immatriculation,
      description,
      isFavorite,
    } = req.body;

    const newPlane = new Plane({
      type,
      picture,
      compagnie,
      immatriculation,
      description,
      isFavorite,
    });

    const response = await newPlane.save();
    res.json({ result: 'New plane in db' });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du Plane dans la db" });
  }
});

//GET /favoris Récuperer les favoris de Planes & les types d'aircrafts



module.exports = router;