require('../models/connection');
var express = require('express');
var router = express.Router();
const Badge = require('../models/badges');
const User = require('../models/users');


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


// Fonction pour vérifier si l'utilisateur a des vols
async function hasUserFlights(user) {
  return user.flights.length > 0;
}


//Condition pour le badge Ice :

// Liste des pays les plus froids du monde
const coldestCountries = [
  'Sheremetyevo International Airport',
  'Toronto Pearson International Airport',
  'Los Angeles International Airport',
  'Keflavik International Airport',
  'Helsinki-Vantaa Airport',
];

async function hasVisitedEnoughColdestCountries(user) {
  try {
    const userWithFlights = await User.findById(user._id)
      .populate({
        path: 'flights',
        populate: {
          path: 'airportArr'
        }
      });

    if (!userWithFlights || !userWithFlights.flights) {
      return false;
    }

    const userFlights = userWithFlights.flights;
    const arrivalCountriesCount = {};

    // Compter le nombre de fois que chaque pays d'arrivée apparaît
    userFlights.forEach((flight) => {
      const airportArrCountry = flight.airportArr.name;
      if (coldestCountries.includes(airportArrCountry)) {
        if (arrivalCountriesCount.hasOwnProperty(airportArrCountry)) {
          arrivalCountriesCount[airportArrCountry]++;
        } else {
          arrivalCountriesCount[airportArrCountry] = 1;
        }
      }
    });

    // Vérifier si l'utilisateur a visité au moins 4 fois un pays, le même pays comptes
    const countriesVisitedAtLeastFourTimes = Object.values(arrivalCountriesCount).some(count => count >= 4);
    return countriesVisitedAtLeastFourTimes;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false;
  }
}








//Condition pour le badge  FIRE :

async function hasVisitedEnoughHottestCountries(user) {
  const hottestCountries = [
    'Kuwait International Airport',
    'United Arab Emirates',
    'King Khalid International Airport',
    'Hamad International Airport',
  ];
  try {
    const userWithFlights = await User.findById(user._id)
      .populate({
        path: 'flights',
        populate: {
          path: 'airportArr'
        }
      });

    if (!userWithFlights.flights) {
      return false;
    }

    const userFlights = userWithFlights.flights;
    const arrivalCountriesCount = {};
    userFlights.forEach((flight) => {
      const airportArrCountry = flight.airportArr.name;
      if (hottestCountries.includes(airportArrCountry)) { // Vérifier si le pays fait partie des pays les plus chauds
        if (arrivalCountriesCount.hasOwnProperty(airportArrCountry)) {
          arrivalCountriesCount[airportArrCountry]++;
        } else {
          arrivalCountriesCount[airportArrCountry] = 1;
        }
      }
    });

    const countriesVisitedAtLeastFourTimes = Object.values(arrivalCountriesCount).filter(count => count >= 4);
    return countriesVisitedAtLeastFourTimes.length > 0;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false;
  }
}




// Fonction pour vérifier si l'utilisateur a visité suffisamment de pays les plus friendly.
async function hasVisitedEnoughFriendliestCountries(user) {
  const friendliestCountries = [
    'New Zealand',
    'Copenhagen Airport',
    'Lisbon Portela Airport',
    'Switzerland',
    'Toronto Pearson International Airport',
    'Narita International Airport',
    'Sydney Kingsford Smith Airport',
  ];

  try {
    // Récupérer l'utilisateur avec ses vols depuis la base de données en utilisant populate
    const userWithFlights = await User.findById(user._id)
      .populate({
        path: 'flights',
        populate: {
          path: 'airportArr'
        }
      });
      
    // Assurez-vous que l'utilisateur a bien ses vols
    if (!userWithFlights.flights) {
      return false;
    }

    const userFlights = userWithFlights.flights;
    const arrivalCountriesCount = {};
    userFlights.forEach((flight) => {
      const airportArrCountry = flight.airportArr.name;
      if (friendliestCountries.includes(airportArrCountry)) { // Vérifier si le pays fait partie des pays les plus amicaux
        if (arrivalCountriesCount.hasOwnProperty(airportArrCountry)) {
          arrivalCountriesCount[airportArrCountry]++;
        } else {
          arrivalCountriesCount[airportArrCountry] = 1;
        }
      }
    });
    
    // Vérifier si l'utilisateur a visité au moins 4 fois un pays parmi les plus amicaux
    const countriesVisitedAtLeastFourTimes = Object.values(arrivalCountriesCount).filter(count => count >= 4);
    return countriesVisitedAtLeastFourTimes.length > 0;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des vols de l'utilisateur :", error);
    return false;
  }
}



//Condition pour  le badge Five select : A SUPPRIMER ?

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
    const userArrivalPlaces = userWithFlights.flights.map((flight) => flight.airportNameDest);

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

    //Réponse de la route 
    const unlockedBadges = [];

    //Vérifie si l'utilisateur a des vols et débloquez le badge "Discovery" si nécessaire
    const discoverBadge = await Badge.findOne({ name: 'Discover' });
    if (discoverBadge && await hasUserFlights(user)) {
      if (!user.badges.some(badge => badge.equals(discoverBadge._id))) {
        user.badges.push(discoverBadge);
        unlockedBadges.push(discoverBadge)
      }
    }


    // Débloquez le badge Golden si l'utilisateur a 1000 points
    const totalPoints = user.totalPoints;
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
    if (unlockedBadges.length >0){
    res.json({ message: 'Badges débloqués avec succès', unlockedBadges });
    } else {
      res.json({ message: 'Aucun badge débloqué' });
    }

  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ error: 'Erreur lors du déblocage des badges' });
  }
});


module.exports = router;
