require('../models/connection');
var express = require('express');
var router = express.Router();
const Badge = require('../models/badges');
const User = require('../models/users');
const Flight = require('../models/flights')


//GET pour récupérer tous les badges par un id 
router.get('/', async (req, res) => {
  try {
    const data = await Badge.find();
    res.json({ result: 'Tous les bages sont récupérés', data });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des bagdes dans la db' });
  }
});


//Récupérer un badge par son ID (Badge Discover) OK
router.get('/:id', async (req, res) => {
  try {
    const data = await Badge.findById(req.params.id);
    if (data) {
      res.json({ result: true, data });
    } else {
      res.status(404).json({ error: 'Badge not found' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du badge :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




// OBTENTION BADGES PAR CONDITIONS :

//Condition pour le badge Ice :

// Liste des pays les plus froids du monde
const coldestCountries = [
  'Russia',
  'Canada',
  'United States (Alaska)',
  'Greenland',
  'Iceland',
  'Norway',
  'Finland',
  'Sweden',
];

// Fonction pour vérifier si l'utilisateur a visité les pays les plus froids du monde en fonction des destinations d'arrivée
async function hasVisitedEnoughColdestCountries(user) {
  try {
    // Récupérer l'utilisateur avec ses vols depuis la base de données en utilisant populate
    const userWithFlights = await User.findById(user._id).populate('flights');

    // Assurez-vous que l'utilisateur a bien ses vols
    if (!userWithFlights.flights) {
      return false;
    }

    // Mapper les vols pour obtenir une liste des destinations d'arrivée
    const userArrivalPlaces = userWithFlights.flights.map((flight) => flight.arrivalPlace);

    // Compter le nombre de destinations d'arrivée visitées qui font partie des pays les plus froids
    let visitedColdestCountriesCount = 0;
    for (let i = 0; i < userArrivalPlaces.length; i++) {
      if (coldestCountries.includes(userArrivalPlaces[i])) {
        visitedColdestCountriesCount++;
      }
    }

    // Vérifier si l'utilisateur a visité au moins 4 des pays les plus froids
    return visitedColdestCountriesCount >= 4;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false; // Retourner false en cas d'erreur
  }
}





//Condition pour le badge  FIRE :

async function hasVisitedEnoughHottestCountries(user) {
  const hottestCountries = [
    'Iran',
    'Kuwait',
    'Iraq',
    'United Arab Emirates',
    'Oman',
    'Pakistan',
    'Saudi Arabia',
    'Qatar',
  ];
  try {
    // Récupérer l'utilisateur avec ses vols depuis la base de données en utilisant populate
    const userWithFlights = await User.findById(user._id).populate('flights');
    
    // Assurez-vous que l'utilisateur a bien ses vols
    if (!userWithFlights.flights) {
      return false;
    }

    // Mapper les vols pour obtenir une liste des destinations d'arrivée
    const userArrivalPlaces = userWithFlights.flights.map((flight) => flight.arrivalPlace);
   
    

    // Compter le nombre de destinations d'arrivée visitées qui font partie des pays les plus chauds
    let visitedHottestCountriesCount = 0;
    for (let i = 0; i < userArrivalPlaces.length; i++) {
      if (hottestCountries.includes(userArrivalPlaces[i])) {
        visitedHottestCountriesCount++;
      }
    }
    
    // Vérifier si l'utilisateur a visité au moins 4 des pays les plus chauds
    return visitedHottestCountriesCount >= 4;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false; // Retourner false en cas d'erreur
  }
}




// Fonction pour vérifier si l'utilisateur a visité suffisamment de pays les plus friendly.
async function hasVisitedEnoughFriendliestCountries(user) {
  const friendliestCountries = [
    'New Zealand',
    'Denmark',
    'Portugal',
    'Switzerland',
    'Canada',
    'Austria',
    'Japan',
    'Australia',
  ];

  try {
    // Récupérer l'utilisateur avec ses vols depuis la base de données en utilisant populate
    const userWithFlights = await User.findById(user._id).populate('flights');
    
    // Assurez-vous que l'utilisateur a bien ses vols
    if (!userWithFlights.flights) {
      return false;
    }

    // Mapper les vols pour obtenir une liste des destinations d'arrivée
    const userArrivalPlaces = userWithFlights.flights.map((flight) => flight.arrivalPlace);
    
    // Compter le nombre de destinations d'arrivée visitées qui font partie des pays les plus friendly
    let visitedFriendliestCountriesCount = 0;
    for (let i = 0; i < userArrivalPlaces.length; i++) {
      if (friendliestCountries.includes(userArrivalPlaces[i])) {
        visitedFriendliestCountriesCount++;
      }
    }

    // Vérifier si l'utilisateur a visité au moins 4 des pays les plus friendly
    return visitedFriendliestCountriesCount >= 4;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false; // Retourner false en cas d'erreur
  }
}


//Condition pour  le badge Five select :

async function hasVisitedEnoughContinents(user) {
  const continents = [
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'North America',
    'Oceania',
    'South America',
  ];

  try {
    // Récupérer l'utilisateur avec ses vols depuis la base de données en utilisant populate
    const userWithFlights = await User.findById(user._id).populate('flights');
    
    // Assurez-vous que l'utilisateur a bien ses vols
    if (!userWithFlights.flights) {
      return false;
    }

    // Mapper les vols pour obtenir une liste des destinations d'arrivée
    const userArrivalPlaces = userWithFlights.flights.map((flight) => flight.arrivalPlace);
    
    // Compter le nombre de continents visités
    let visitedContinents = 0;
    for (let i = 0; i < userArrivalPlaces.length; i++) {
      if (continents.includes(userArrivalPlaces[i])) {
        visitedContinents++;
      }
    }

    // Vérifier si l'utilisateur a visité au moins 5 continents
    return visitedContinents >= 5;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false; // Retourner false en cas d'erreur
  }
}


// Route pour débloquer TOUT les badges :

// Route POST pour débloquer les badges en fonction des points et des critères spécifiques
router.post('/unlockBadges', async (req, res) => {
  const { userId } = req.body;

  try {
    // Recherchez l'utilisateur dans la base de données par son ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const unlockedBadges = [];
    const totalPoints = user.totalPoints;

    // Débloquez le badge Golden si l'utilisateur a 1000 points
    if (totalPoints >= 10000) {
      const goldenBadge = await Badge.findOne({ name: 'Golden' });
      if (goldenBadge && !user.badges.some(badge => badge.equals(goldenBadge._id))) {
        user.badges.push(goldenBadge);
        unlockedBadges.push(goldenBadge)
      }
    }

    // Débloquez le badge Ice si l'utilisateur a visité au moins 4 pays Froid
    const hasEnoughColdCountries = await hasVisitedEnoughColdestCountries(user);
    if (hasEnoughColdCountries) {
      const iceBadge = await Badge.findOne({ name: 'Ice' });
      if (iceBadge && !user.badges.some(badge => badge.equals(iceBadge._id))) {
        user.badges.push(iceBadge);
        unlockedBadges.push(iceBadge)
      }
    }

    // Débloquez le badge Fire si l'utilisateur a visité au moins 4 pays chauds
    const hasEnoughHottestCountries = await hasVisitedEnoughHottestCountries(user);
    if (hasEnoughHottestCountries) {
      const fireBadge = await Badge.findOne({ name: 'Fire' });
      if (fireBadge && !user.badges.some(badge => badge.equals(fireBadge._id))) {
        user.badges.push(fireBadge);
        unlockedBadges.push(fireBadge)
      }
    }

    // Débloquez le badge Friendly si l'utilisateur a visité au moins 4 pays amicaux
    const hasEnoughFriendlyCountries = await hasVisitedEnoughFriendliestCountries(user);
    if (hasEnoughFriendlyCountries) {
      const friendlyCountry = await Badge.findOne({ name: 'Ray' });
      if (friendlyCountry && !user.badges.some(badge => badge.equals(friendlyCountry._id))) {
        user.badges.push(friendlyCountry);
        unlockedBadges.push(friendlyCountry)
      }
    }

    // Débloquez le badge Five Select si l'utilisateur a visité au moins 5 continents
    const hasEnoughContinents = await hasVisitedEnoughContinents(user);
    if (hasEnoughContinents) {
      const continents = await Badge.findOne({ name: 'Five Select' });
      if (continents && !user.badges.some(badge => badge.equals(continents._id))) {
        user.badges.push(continents);
        unlockedBadges.push(continents)
      }
    }

    // Enregistrez les modifications de l'utilisateur dans la base de données
    await user.save();

    res.json({ message: 'Badges débloqués avec succès', unlockedBadges });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ error: 'Erreur lors du déblocage des badges' });
  }
});


module.exports = router;
