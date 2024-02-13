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

//Route GET pour récupérer toute les infos de l'utilisateur : 
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
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Répondre avec un message indiquant que les vols de l'utilisateur ont été mis à jour avec succès
    res.status(200).json({ message: 'Les vols de l\'utilisateur ont été mis à jour avec succès' });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec le code d'erreur approprié
    console.error('Erreur lors de la mise à jour des vols de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des vols de l\'utilisateur' });
  }
});



/*Route PUT */

//MODIFIER LE PASSWORD
router.put('/password', async (req, res) => {
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
    res.json({ result:true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du mot de passe" });
  }
});

//Route Put pour mettre à jour le nombre de point de l'utilisateur : 
router.put('/pointsTotal/:userId', async (req, res) => {
  try {
    // Récupére l'ID de l'utilisateur à partir de la requête
    const { userId } = req.params;

    // Récupére les nouveaux points à partir du corps de la requête
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


/*Route POST */

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

    // Vérifier si l'utilisateur possède déjà le badge
    if (user.badges.includes(badgeId)) {
      return res.status(400).json({ message: "L'utilisateur possède déjà ce badge" });
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




router.post('/associateFlights/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { flightIds } = req.body; 

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Fusionner les nouveaux vols avec les vols existants de l'utilisateur
    user.flights = [...user.flights, ...flightIds]; 

    // Enregistre les modifications dans la base de données
    await user.save();

    return res.status(200).json({ message: 'Vols associés à l\'utilisateur avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'association des vols à l\'utilisateur :', error);
    return res.status(500).json({ error: 'Erreur serveur lors de l\'association des vols à l\'utilisateur' });
  }
});





/*Route GET */

// Route pour récupérer les infos de tous les vols de l'utilisateur
router.get('/userFlightInfo/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche de l'utilisateu r dans la base de données avec tous les vols associés
    const user = await User.findById(userId).populate('flights'); 
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Si l'utilisateur n'a pas de vol associé
    if (!user.flights || user.flights.length === 0) {
      return res.status(400).json({ error: 'L\'utilisateur n\'a pas de vol associé' });
    }

    // Renvoyer toutes les informations des vols associés
    return res.status(200).json({ flightsInfo: user.flights });
  } catch (error) {
    console.error('Erreur lors de la récupération des infos des vols de l\'utilisateur :', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la récupération des infos des vols de l\'utilisateur' });
  }
});




module.exports = router;
