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

    if (!checkBody(req.body, ['firstname', 'lastname', 'mail', 'password'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
     // Validation du mot de passe avec Maj/Number/Special Caracter
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.json({ result: false, error: 'Password must contain at least 8 characters, including uppercase, lowercase, digit, and special character' });
      return;
    }

    //On utilise le mail pour avoir un identifiant unique au lieu du password qui est haché
    const userData = await User.findOne({ mail });

    if (userData) {
      res.json({ result: false, error: 'User already exists' });
    } else {
      const newUser = new User({
        firstname,
        lastname,
        password: hash, // Utilisez le nouveau hachage généré
        mail,
        token: uid2(32),
      });

      const userData = await newUser.save();
      res.json({ result: true, userData });
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

    const userData = await User.findOne({ mail });

    if (userData && bcrypt.compareSync(password, userData.password)) {
      res.json({ result: true, userData });
    } else {
      res.json({ result: false, error: 'Mail or Password invalid' });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ result: false, error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
