var express = require("express");
var router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt"); // Pour le hachage des mots de passe
const Badge = require("../models/badges");
const Flight = require("../models/flights");

//Modifier le password OK
router.put("/password", async (req, res) => {
  try {
    // Récupérer les données du corps de la requête
    const { mail, newPassword } = req.body;

    // Recherchez l'utilisateur dans la base de données
    const data = await User.findOne({ mail });

    // Vérifiez si l'utilisateur existe
    if (!data) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Hache le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettez à jour le mot de passe de l'utilisateur dans la base de données
    data.password = hashedNewPassword;
    await data.save();

    // Renvoyez une réponse de succès
    res.json({ result: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du mot de passe" });
  }
});

// Route GET pour récupérer les points de l'utilisateur OKAY
router.get('/totalPoints/:userId/', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Recherchez l'utilisateur dans la base de données par son ID
    const user = await User.findById(userId);

    // Vérifiez si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Renvoyez les points de l'utilisateur
    return res.status(200).json({ success: true, totalPoints: user.totalPoints });
  } catch (error) {
    console.error('Erreur lors de la récupération des points de l\'utilisateur:', error.message);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des points de l\'utilisateur' });
  }
});



//Ajout des points du badge au totalPoints du user OK (ne marche pas)
router.put("/addPoints", async (req, res) => {
  try {
    // Récupére les nouveaux points à partir du corps de la requête
    const { userId, pointsToAdd } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const data = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!data) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour le nombre total de points de l'utilisateur
    data.totalPoints += pointsToAdd;
    await data.save();

    // Renvoyer une réponse de succès
    res.json({
      result: true,
      message: "Nombre de points de l'utilisateur mis à jour avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Erreur lors de la mise à jour du nombre total de points de l'utilisateur",
    });
  }
});

// Ajout d'un badge à un User OK
router.post("/addBadges", async (req, res) => {
  try {
    // Récupérer les données du corps de la requête
    const { userId, badgeId } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur possède déjà le badge
    if (user.badges.includes(badgeId)) {
      return res
        .status(400)
        .json({ message: "L'utilisateur possède déjà ce badge" });
    }

    // Rechercher le badge dans la base de données
    const badge = await Badge.findById(badgeId);

    // Vérifier si le badge existe
    if (!badge) {
      return res.status(404).json({ message: "Badge non trouvé" });
    }

    // Ajout du badge complet à la collection de l'utilisateur
    user.badges.push(badge);

    // Sauvegarder les modifications dans la base de données
    await user.save();

    // Renvoyer une réponse de succès
    res.json({ message: "Badge ajouté avec succès à l'utilisateur" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du badge à l'utilisateur" });
  }
});

//Route put pour modifié les flights de l'utilisateur: 
router.put('/:userId/flight', async (req, res) => {
  const userId = req.params.userId;
  const { flight } = req.body; // Les nouveaux vols à assigner à l'utilisateur

  try {
    // Mettre à jour les vols de l'utilisateur dans la collection User
    const updateResult = await User.updateOne(
      { _id: userId }, // Filtrer l'utilisateur par son ID
      { $set: { flights: flight } } // Remplacer les vols de l'utilisateur par les nouveaux vols
    );

    if (updateResult.nModified === 0) {
      // Aucune modification effectuée, utilisateur non trouvé
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Répondre avec un message indiquant que les vols de l'utilisateur ont été mis à jour avec succès
    res.status(200).json({
      message: "Les vols de l'utilisateur ont été mis à jour avec succès",
    });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec le code d'erreur approprié
    console.error(
      "Erreur lors de la mise à jour des vols de l'utilisateur :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la mise à jour des vols de l'utilisateur",
    });
  }
});


//associé un vol à un utilisateur OKAY
router.post("/associateFlights/:userId", async (req, res) => { 
  try {
    const userId = req.params.userId;
    const { flightId, planeId} = req.body;


    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Fusionner les nouveaux vols avec les vols existants de l'utilisateur
    if (!user.flights.includes(flightId)) {
      user.flights.push(flightId);
    }

    // Fusionner les nouveaux avions avec les avions existants de l'utilisateur
    if (!user.planes.includes(planeId)) {
      user.planes.push(planeId); 
    }
    // Enregistre les modifications dans la base de données
    await user.save();

    return res
      .status(200)
      .json({ message: "Vols associés à l'utilisateur avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de l'association des vols à l'utilisateur :",
      error
    );
    return res.status(500).json({
      error: "Erreur serveur lors de l'association des vols à l'utilisateur",
    });
  }
});




// Route pour récupérer les infos de tous les vols de l'utilisateur
router.get("/userFlightInfo/:userId", async (req, res) => {
  try {
    const userId = req.query.userId;

    // Recherche de l'utilisateur dans la base de données avec tous les vols associés
    const user = await User.findById(userId).populate("flights");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Si l'utilisateur n'a pas de vol associé
    if (!user.flights || user.flights.length === 0) {
      return res
        .status(400)
        .json({ error: "L'utilisateur n'a pas de vol associé" });
    }

    // Renvoyer toutes les informations des vols associés
    return res.status(200).json({ flightsInfo: user.flights });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des infos des vols de l'utilisateur :",
      error
    );
    return res.status(500).json({
      error:
        "Erreur serveur lors de la récupération des infos des vols de l'utilisateur",
    });
  }
});

//Ajouter ou Enlever des points au totalPoints du User
router.put("/updatePoints/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { pointsToAdd, pointsToRemove } = req.body;

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (pointsToRemove && user.totalPoints < pointsToRemove) {
      return res.status(400).json({ message: "L'utilisateur n'a pas suffisamment de points pour cette réduction" });
    }

    // Modification des points de l'utilisateur
    if (pointsToRemove) {
      user.totalPoints -= pointsToRemove;
    }

    if (pointsToAdd) {
      user.totalPoints += pointsToAdd;
    }

    await user.save();

    return res.json({
      result: true,
      message: "Points de l'utilisateur mis à jour avec succès",
      newTotalPoints: user.totalPoints
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des points de l'utilisateur :", error);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour des points de l'utilisateur"
    });
  }
});





module.exports = router;
