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

//Récupérer tous les Planes du user OKOK
router.get("/allPlanes/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Récupére tous les Planes du user
    const planes = await Plane.find({ _id: { $in: user.planes } });

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

//ADD d'un Plane en Favoris OKOK
router.put("/addFavoris/:userId/:planeId", async (req, res) => {
  const { userId, planeId } = req.params;

  try {
    // Vérification du user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found"  });
    }

    // Vérification si le plane existe et update en Favoris
    const updatedPlane = await Plane.findByIdAndUpdate(
      planeId,
      { isFavorite: true },
      { new: true }
    );

    if (!updatedPlane) {
      return res.status(404).json({ message: "Plane non trouvé avec l'ID fourni" });
    }

    res.status(200).json({ result:true, message: "Plane ajouté au User avec succès"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'ajout du Plane favori au user" });
  }
});

// REMOVE d'un Plane des Favoris OKOK
  router.put("/removeFavoris/:userId/:planeId", async (req, res) => {
    const { userId, planeId } = req.params;
  
    try {
      //  Vérification du user
      const user = await User.findById(userId).populate('planes');
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let plane;
  
      if (planeId) {
        // Cherche l'avion correspondant à planeId dans les Planes du User
        plane = user.planes.find(plane => plane._id.toString() === planeId);
  
        if (!plane) {
          return res.status(404).json({ message: "Plane not found with this Id" });
        }
        plane.isFavorite = false;// Mets isFavorite à false pour le Plane trouvé
        await plane.save();
      }
  
      res.status(200).json({ result:true, message: "Plane enlevé des favoris du user avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors du retrait du Plane des favoris du User" });
    }
  });

//Récuperer les favoris de Planes de l'utilisateur OKAY

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


router.delete('/delete/:userId/:planeId', async (req, res) => {
  const userId = req.params.userId;
  const planeId = req.params.planeId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si l'avion appartient à cet utilisateur
    const planeIndex = user.planes.findIndex(plane => plane._id.toString() === planeId);
    if (planeIndex === -1) {
      return res.status(404).json({ message: 'Avion non trouvé dans la galerie de cet utilisateur.' });
    }
    // Supprimer l'avion de la galerie de l'utilisateur
    user.planes.splice(planeIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Avion supprimé avec succès de la galerie de cet utilisateur.' });
  } catch (error) {
    // En cas d'erreur, renvoyer un statut 500 (Internal Server Error) avec un message d'erreur
    console.error('Erreur lors de la suppression de l\'avion de la galerie de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'avion de la galerie de l\'utilisateur.' });
  }
});


module.exports = router;
