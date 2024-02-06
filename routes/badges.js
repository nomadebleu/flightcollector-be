require('../models/connection');
var express = require('express');
var router = express.Router();
const Badge = require('../models/badges');

//GET pour récupérer tous les badges
router.get('/', async (req, res) => {
  try {
    const data = await Badge.find();
    res.json({ result: 'Tous les bages sont récupérés',data });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des bagdes dans la db" });
  }
});


module.exports = router;