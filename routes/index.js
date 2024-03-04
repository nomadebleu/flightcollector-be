require("../models/connection");
var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const uid2 = require("uid2");
const token = uid2(32);

const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "ddreb3nm6",
  api_key: "342387261832956",
  api_secret: "lzxO7d6dYHFjVbjLR8veX1A9b-8",
});

// GESTION CLOUDINARY
router.post("/upload", async (req, res) => {
  try {
    const image = `data:image/png;base64,${req.body.image}`;
    const result = await cloudinary.uploader.upload(image, {});
    res.status(200).json({ image: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error });
    throw new Error(error);
  }
});
// Update Photo profil
router.put("/putImage/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { imageUrl } = req.body;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Ajouter l'URL de l'image à l'utilisateur
    if (!user.pictureProfil) {
      user.pictureProfil = "";
    }
    user.pictureProfil = imageUrl;
    // Enregistrer les modifications dans la base de données
    await user.save();

    return res
      .status(200)
      .json({ message: "Image associée à l'utilisateur avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de l'association de l'image à l'utilisateur :",
      error
    );
    return res.status(500).json({
      error: "Erreur serveur lors de l'association de l'image à l'utilisateur",
    });
  }
});


// SIGNUP
router.post("/signup", async (req, res) => {
  console.log("ok");
  try {
    const { firstname, lastname, password, mail } = req.body;
    const hash = bcrypt.hashSync(password, 10); // Utilise bcrypt.hashSync pour hacher le mdp

    const { result, errors } = checkBody(req.body, [
      "firstname",
      "lastname",
      "mail",
      "password",
    ]);

    if (!result) {
      res.json({ result: false, errors }); // Renvoie les erreurs
      return;
    }

    //On utilise le mail pour avoir un identifiant unique au lieu du password qui est haché
    const existingUser = await User.findOne({ mail });

    if (existingUser) {
      res.json({ result: false, error: "User already exists" });
    } else {
      const newUser = new User({
        firstname,
        lastname,
        password: hash, // Utilisez le nouveau hachage généré
        mail,
        token: uid2(32),
        pictureProfil: "",
        totalPoints: 0,
        isConnected: true,
      });

      const savedUser = await newUser.save();
      res.json({ result: true, data: savedUser });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur" });
  }
});

//SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!checkBody(req.body, ["mail", "password"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }
    const { result, errors } = checkBody(req.body, ["mail", "password"]);

    if (!result) {
      res.json({ result: false, errors }); // Renvoie les erreurs
      return;
    }

    const data = await User.findOne({ mail })
      .populate("badges")
      .populate("flights")
      .populate("planes");

    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, data });
    } else {
      res.json({ result: false, error: "Mail or Password invalid" });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur" });
  }
});

module.exports = router;
