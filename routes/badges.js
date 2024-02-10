require('../models/connection');
var express = require('express');
var router = express.Router();
const Badge = require('../models/badges');
const User = require('../models/users')


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

// Route pour récupérer un badge par son ID
router.get("/:id", async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (badge) {
      res.json(badge);
    } else {
      res.status(404).json({ error: "Badge non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du badge :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// OBTENTION BADGES PAR CONDITIONS : 

//Condition pour le Badge GOLDEN : 

router.post('/unlockbadge/Golden/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Récupérer l'utilisateur depuis la base de données en utilisant son ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Obtenez le nombre total de points de l'utilisateur
    let userTotalPoints = user.pointsTotal; 

    const goldenBadgePoints = 10000;

    // Logique conditionnelle pour débloquer le badge Golden
    if (userTotalPoints >= goldenBadgePoints) {
      // Ajouter 1000 points à l'utilisateur
      user.pointsTotal += 1000;

        // Vérifier d'abord si l'utilisateur n'a pas déjà le badge Golden
        if (!user.badges.includes('65c25c6b3eac6b8b352dafcf')) {
          // Ajoutez le badge Golden à la liste des badges de l'utilisateur
          user.badges.push('65c25c6b3eac6b8b352dafcf');
        }

      // Mettre à jour la base de données avec les nouveaux points
      await user.save();

      // Débloquer le badge pour l'utilisateur
      return res.send('Félicitations ! Vous avez débloqué le badge GOLDEN et gagné 1000 points.');
    } else {
      return res.status(403).send('Vous n\'avez pas visité suffisamment de pays froids pour débloquer le badge GOLDEN');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});




//Condition pour le badge Ice : 

// Liste des pays les plus froids du monde
const coldestCountries = ["Russia", "Canada", "United States (Alaska)", "Greenland", "Iceland", "Norway", "Finland", "Sweden"];

// Fonction pour vérifier si l'utilisateur a visité les pays les plus froids du monde en fonction des destinations d'arrivée
function hasVisitedEnoughColdestCountries(user) {
  // Récupérer les destinations d'arrivée visitées par l'utilisateur
  const userArrivalPlaces = user.flights.map(flight => flight.arrivalPlace);
  console.log(userArrivalPlaces)

  // Compter le nombre de destinations d'arrivée visitées qui font partie des pays les plus froids
  let visitedColdestCountriesCount = 0;
  for (let i = 0; i < userArrivalPlaces.length; i++) {
    if (coldestCountries.includes(userArrivalPlaces[i])) {
      visitedColdestCountriesCount++;
    }
  }

  // Vérifier si l'utilisateur a visité au moins 4 des pays les plus froids
  return visitedColdestCountriesCount >= 4;
}


// Route pour débloquer le badge ICE
router.post('/unlockbadge/Ice/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer l'utilisateur depuis la base de données en utilisant son ID
    const user = await User.findById(userId).populate('flights');
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur a visité suffisamment de pays froids pour débloquer le badge ICE
    if (hasVisitedEnoughColdestCountries(user)) {
      // Ajouter 900 points à l'utilisateur
      user.pointsTotal += 900;

        
      if (!user.badges.includes('65c25e2a3511d200c07c0a92')) {
        
        user.badges.push('65c25e2a3511d200c07c0a92');
      }

      // Mettre à jour la base de données avec les nouveaux points et la référence de badge
      await user.save();

      // Débloquer le badge ICE pour l'utilisateur
      return res.send('Félicitations ! Vous avez débloqué le badge ICE et gagné 900 points.');
    } else {
      return res.status(403).send('Vous n\'avez pas visité suffisamment de pays froids pour débloquer le badge ICE.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur interne du serveur');
  }
});








//Condition pour le badge  FIRE : 

const hottestCountries = ["Iran", "Kuwait", "Iraq", "United Arab Emirates", "Oman", "Pakistan", "Saudi Arabia", "Qatar"];

function hasVisitedEnoughHottestCountries(user) {
  // Récupérer les destinations d'arrivée visitées par l'utilisateur
  const userArrivalPlaces = user.flights.map(flight => flight.arrivalPlace);

  // Compter le nombre de destinations d'arrivée visitées qui font partie des pays les plus chauds
  let visitedHottestCountriesCount = 0;
  for (let i = 0; i < userArrivalPlaces.length; i++) {
    if (hottestCountries.includes(userArrivalPlaces[i])) {
      visitedHottestCountriesCount++;
    }
  }

  // Vérifier si l'utilisateur a visité au moins 4 des pays les plus chauds
  return visitedHottestCountriesCount >= 4;
}


// Route pour débloquer le badge Fire
router.post('/unlockbadge/Fire/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer l'utilisateur depuis la base de données en utilisant son ID
    const user = await User.findById(userId).populate('flights');
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur a visité suffisamment de pays chauds pour débloquer le badge HOT
    if (hasVisitedEnoughHottestCountries(user)) {
      // Ajouter 800 points à l'utilisateur
      user.pointsTotal += 800;

      if (!user.badges.includes('65c25ea13511d200c07c0a93')) {
        
        user.badges.push('65c25ea13511d200c07c0a93');
      }
      // Mettre à jour la base de données avec les nouveaux points et la référence de badge
      await user.save();

      // Débloquer le badge Fire pour l'utilisateur
      return res.send('Félicitations ! Vous avez débloqué le badge Fire et gagné 800 points.');
    } else {
      return res.status(403).send('Vous n\'avez pas visité suffisamment de pays chauds pour débloquer le badge HOT.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur interne du serveur');
  }
});




//Condition pour  le badge Ray : 

const friendliestCountries = ["New Zealand", "Denmark", "Portugal", "Switzerland", "Canada", "Austria", "Japan", "Australia"];

// Fonction pour vérifier si l'utilisateur a visité suffisamment de pays les plus friendly.
function hasVisitedEnoughFriendliestCountries(user) {
  // Récupérer les destinations d'arrivée visitées par l'utilisateur
  const userArrivalPlaces = user.flights.map(flight => flight.arrivalPlace);

  // Compter le nombre de destinations d'arrivée visitées qui font partie des pays les plus friendly.
  let visitedFriendliestCountriesCount = 0;
  for (let i = 0; i < userArrivalPlaces.length; i++) {
    if (friendliestCountries.includes(userArrivalPlaces[i])) {
      visitedFriendliestCountriesCount++;
    }
  }

  // Vérifier si l'utilisateur a visité au moins 4 des pays les plus friendly.
  return visitedFriendliestCountriesCount >= 4;
}

// Route pour débloquer le badge Ray
router.post('/unlockbadge/ray/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer l'utilisateur depuis la base de données en utilisant son ID
    const user = await User.findById(userId).populate('flights');
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur a visité suffisamment de pays gentils pour débloquer le badge Friendly
    if (hasVisitedEnoughFriendliestCountries(user)) {
      // Ajouter des points à l'utilisateur
      user.pointsTotal += 500;

      if (!user.badges.includes('65c25f3f3511d200c07c0a94')) {
        
        user.badges.push('65c25f3f3511d200c07c0a94');
      }

      // Mettre à jour la base de données avec les nouveaux points et la référence de badge
      await user.save();

      // Débloquer le badge FRIENDLY pour l'utilisateur
      return res.send('Félicitations ! Vous avez débloqué le badge Friendly et gagné 500 points.');
    } else {
      return res.status(403).send('Vous n\'avez pas visité suffisamment de pays friendly pour débloquer le badge Friendly.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur interne du serveur');
  }
});


//Condition pour  le badge Five select : 

const continents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

// Fonction pour vérifier si l'utilisateur a visité au moins 5 continents
function hasVisitedEnoughContinents(user) {
  // Récupérer les destinations d'arrivée visitées par l'utilisateur
  const userArrivalPlaces = user.flights.map(flight => flight.arrivalPlace);

  
  let visitedContinents = 0;
  for (let i = 0; i < userArrivalPlaces.length; i++) {
    if (continents.includes(userArrivalPlaces[i])) {
      visitedContinents++;
    }
  }

  
  return visitedContinents >= 5;
}

// Route pour débloquer le badge FiveContinents
router.post('/unlockbadge/FiveContinents/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer l'utilisateur depuis la base de données en utilisant son ID
    const user = await User.findById(userId).populate('flights');
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    if (hasVisitedEnoughContinents(user)) {
      // Ajouter des points à l'utilisateur
      user.pointsTotal += 1000;

      if (!user.badges.includes('65c261413511d200c07c0a96')) {
        
        user.badges.push('65c261413511d200c07c0a96');
      }

      // Mettre à jour la base de données avec les nouveaux points et la référence de badge
      await user.save();

      return res.send('Félicitations ! Vous avez débloqué le badge FiveContinents et gagné 1000 points.');
    } else {
      return res.status(403).send('Vous n\'avez pas visité suffisamment de Continents pour débloquer le badge FiveContinents.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur interne du serveur');
  }
});



module.exports = router;