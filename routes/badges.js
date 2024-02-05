require('../models/connection');
var express = require('express');
var router = express.Router();
const Badge = require('../models/badges');

//POST pour enregistrer un badge
router.post('/', async (req, res) => {
  try {
    const {
      picture,
      name,
      description,
      points,
      flights,
    } = req.body;

    const newBadge = new Badge({
      picture,
      name,
      description,
      points,
      flights,
    });

    const response = await newBadge.save();
    res.json({ result: 'New badge in db' });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du Badge dans la db" });
  }
});


module.exports = router;