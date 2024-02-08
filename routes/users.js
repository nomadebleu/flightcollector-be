var express = require('express');
var router = express.Router();
const User = require('../models/users'); 
const bcrypt = require('bcrypt'); // Pour le hachage des mots de passe
const Badge = require('../models/badges')
const Flight = require('../models/flights')

/* GET home page. */
router.get('/', function(req, res) {
  res.json({result:true});
});



//PUT /password :Changer le password
router.put('/password', async (req, res) => {
  try {
    // Récupérer les données du corps de la requête
    const { userId, oldPassword, newPassword } = req.body;

    // Recherchez l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifiez si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifiez si l'ancien mot de passe correspond au mot de passe enregistré dans la base de données
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Le mot de passe actuel est incorrect" });
    }

    // Hachez le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettez à jour le mot de passe de l'utilisateur dans la base de données
    user.password = hashedNewPassword;
    await user.save();

    // Renvoyez une réponse de succès
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du mot de passe" });
  }
});


//POST /ajouter un badge à la BADGES de user

router.post('/addBadges', async (req, res) => {
  try {
    // Récupérer les données du corps de la requête
    const { userId, badgeId } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Rechercher le badge dans la base de données
    const badge = await Badge.findById(badgeId);

    // Vérifier si le badge existe
    if (!badge) {
      return res.status(404).json({ message: "Badge non trouvé" });
    }

    // Ajouter l'ID du badge à la collection de badges de l'utilisateur
    user.badges.push(badgeId);

    // Sauvegarder les modifications dans la base de données
    await user.save();

    // Renvoyer une réponse de succès
    res.json({ message: "Badge ajouté avec succès à l'utilisateur" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du badge à l'utilisateur" });
  }
});



//Route Get pour récupérer le nombre de total de point de l'utilisateur : 
router.get('/userPointsTotal/:userId', async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir de la requête
    const { userId } = req.params;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Renvoyer le nombre total de points de l'utilisateur
    res.json({ totalPoints: user.pointsTotal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération du nombre total de points de l'utilisateur" });
  }
});



//Route Put pour mettre à jour le nombre de point de l'utilisateur : 
router.put('/pointsTotal/:userId', async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir de la requête
    const { userId } = req.params;

    // Récupérer les nouveaux points à partir du corps de la requête
    const { newTotalPoints } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour le nombre total de points de l'utilisateur
    user.pointsTotal = newTotalPoints;
    await user.save();

    // Renvoyer une réponse de succès
    res.json({ message: "Nombre de points de l'utilisateur mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du nombre total de points de l'utilisateur" });
  }
});




// Route pour afficher les places visitées et le nombre de places visitées par l'utilisateur
router.get('/placesVisited/:userId', async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir de la requête
    const { userId } = req.params;

    // Rechercher les vols de l'utilisateur dans la base de données
    const userFlights = await Flight.find({ planes: userId });

    // Initialiser un tableau pour stocker les places visitées uniques
    const visitedPlaces = [];

    // Parcourir les vols de l'utilisateur et ajouter les places visitées au tableau
    userFlights.forEach(flight => {
      if (!visitedPlaces.includes(flight.arrivalPlace)) {
        visitedPlaces.push(flight.arrivalPlace);
      }
    });

    // Nombre de places visitées par l'utilisateur
    const placesVisitedCount = visitedPlaces.length;

    // Renvoyer les places visitées et le nombre de places visitées par l'utilisateur en réponse
    res.json({ visitedPlaces, placesVisitedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des places visitées par l'utilisateur" });
  }
});

module.exports = router;
