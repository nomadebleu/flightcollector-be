require("../models/connection");
var express = require("express");
var router = express.Router();
const Plane = require("../models/planes");
const User = require("../models/users");

//POST pour enregistrer un plane
router.post("/", async (req, res) => {
  try {
    const {
      type,
      picture,
      compagnie,
      immatriculation,
      age,
      description,
      seatMap,
      isFavorite,
    } = req.body;

    const newPlane = new Plane({
      type,
      picture,
      compagnie,
      immatriculation,
      age,
      description,
      seatMap,
      isFavorite,
    });

    const response = await newPlane.save();
    res.json({ result: "New plane in db" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du Plane dans la db" });
  }
});

//Route get pour récupérer tout les planes  OKAY
router.get("/allPlanes/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Récupération de tous les avions associés à l'utilisateur
    const planes = await Promise.all(
      user.planes.map((planeId) => Plane.findById(planeId))
    );

    // Réponse avec les avions trouvés dans le corps de la réponse
    res.json(planes);
  } catch (error) {
    // En cas d'erreur, réponse d'erreur avec le code d'erreur approprié
    console.error("Erreur lors de la récupération des avions :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des avions" });
  }
});

//GET /favoris Récuperer les favoris de Planes & les types d'aircrafts OKAY

router.get("/favoris/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Récupérer les avions associés à l'utilisateur
    await user.populate("planes");
    const numberOfPlanes = user.planes.length;

    // Récupérer les avions favoris de l'utilisateur
    const userFavoritePlanes = user.planes.filter(
      (plane) => plane.isFavorite
    ).length;

    res.json({
      result: true,
      numberOfPlanes: numberOfPlanes,
      userFavoritePlanes: userFavoritePlanes,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des avions et des favoris de l'utilisateur",
      });
  }
});

//Ajoute un avion en favoris OKAY
router.put("/addFavoris/:userId/:planeId", async (req, res) => {
  const { userId, planeId } = req.params;

  try {
    // Trouver l'utilisateur
    const user = await User.findById(userId).populate("planes");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let plane;

    if (planeId) {
      // Chercher l'avion correspondant à planeId dans la liste des avions de l'utilisateur
      plane = user.planes.find((plane) => plane._id.toString() === planeId);

      if (!plane) {
        return res
          .status(404)
          .json({ message: "Avion non trouvé avec l'ID fourni" });
      }

      // Mettre isFavorite à true pour l'avion trouvé
      plane.isFavorite = true;
      await plane.save();
    }

    res
      .status(200)
      .json({
        message: "Avion favori ajouté à l'utilisateur avec succès",
        fav: true,
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "Erreur lors de l'ajout de l'avion favori à l'utilisateur",
      });
  }
});

// Remove des Favoris OKAY
router.put("/removeFavoris/:userId/:planeId", async (req, res) => {
  const { userId, planeId } = req.params;

  try {
    // Trouver l'utilisateur
    const user = await User.findById(userId).populate("planes");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let plane;

    if (planeId) {
      // Chercher l'avion correspondant à planeId dans la liste des avions de l'utilisateur
      plane = user.planes.find((plane) => plane._id.toString() === planeId);

      if (!plane) {
        return res
          .status(404)
          .json({ message: "Avion non trouvé avec l'ID fourni" });
      }

      // Mettre isFavorite à false pour l'avion trouvé
      plane.isFavorite = false;
      await plane.save();
    }

    res
      .status(200)
      .json({
        message: "Avion retiré des favoris de l'utilisateur avec succès",
        fav: false,
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message:
          "Erreur lors du retrait de l'avion des favoris de l'utilisateur",
      });
  }
});

//Pour récupérer un vol avec le numéro d'Immatriculation' OK
router.get("/:immatriculation", async (req, res) => {
  try {
    const immatriculation = req.params.immatriculation;
    const plane = await Plane.findOne({ immatriculation });

    if (!plane) {
      return res
        .status(404)
        .json({ error: "Aucun plane trouvé avec cette immatriculation" });
    }
    res.json({ result: true, data: plane });
  } catch (error) {
    console.error("Erreur lors de la récupération du plane:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du plane." });
  }
});

module.exports = router;
