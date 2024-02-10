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

//Route get pour récupérer tout les planes :
router.get('/allPlanes', async (req, res) => {
  try {
    const planes = await Plane.find();
    res.json({ planes });
  } catch (error) {
    // En cas d'erreur, réponse d'erreur avec le code d'erreur approprié
    console.error('Erreur lors de la récupération des avions :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des avions' });
  }
});

//GET /favoris Récuperer les favoris de Planes & les types d'aircrafts

router.get('/favoris', async (req, res) => {
  try {
    // Récupérer tous les avions marqués comme favoris
    const favorisAvions = await Plane.find({ isFavorite: true });

    // Récupérer les types d'avions distincts
    const typesAircrafts = await Plane.distinct('type');

    // avions récupérés et les types d'avions distincts
    res.json({ result : true, isFavorite : favorisAvions.length, typesAircrafts : typesAircrafts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des avions favoris et des types d'aéronefs" });
  }
});





module.exports = router;