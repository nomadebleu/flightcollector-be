require('../models/connection');
var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

const uid2 = require('uid2');
const token = uid2(32);

const bcrypt = require('bcrypt');

// SIGNUP
router.post('/signup', async (req, res) => {
  console.log('ok');
  try {
    const { firstname, lastname, password, mail } = req.body;
    const hash = bcrypt.hashSync(password, 10); // Utilise bcrypt.hashSync pour hacher le mdp

    const { result, errors } = checkBody(req.body, [
      'firstname',
      'lastname',
      'mail',
      'password',
    ]);

    if (!result) {
      res.json({ result: false, errors }); // Renvoie les erreurs
      return;
    }

    //On utilise le mail pour avoir un identifiant unique au lieu du password qui est haché
    const data = await User.findOne({ mail });

    if (data) {
      res.json({ result: false, error: 'User already exists' });
    } else {
      const newUser = new User({
        firstname,
        lastname,
        password: hash, // Utilisez le nouveau hachage généré
        mail,
        token: uid2(32),
        totalPoints:0,
        isConnected:true,
      });

      const data = await newUser.save();
      res.json({ result: true, data });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ result: false, error: 'Erreur interne du serveur' });
  }
});

//SIGNIN
router.post('/signin', async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!checkBody(req.body, ['mail', 'password'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    const { result, errors } = checkBody(req.body, [
      'mail',
      'password',
    ]);

    if (!result) {
      res.json({ result: false, errors }); // Renvoie les erreurs
      return;
    }

    const data = await User
    .findOne({ mail })
    .populate('badges')
    .populate('flights')
    .populate('planes');

    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, data });
    } else {
      res.json({ result: false, error: 'Mail or Password invalid' });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ result: false, error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
