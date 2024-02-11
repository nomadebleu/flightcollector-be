function checkBody(body, array) {
  //Pour récupérer les erreurs
  let errors = {};

  for (const element of array) {
   
    if (!body[element] || body[element] === '') { 
      //Validation des champs
      errors[element] = `${element} is missing or empty`;
    } else if (element === 'mail' && !isValidEmail(body[element])) {
      // Validation spécifique pour le 'mail'
      errors[element] = `${element} is not a valid email`;
    } else if (element === 'password' && !isValidPassword(body[element])) {
      // Validation spécifique pour le 'password'
      errors[element] = `${element} is not a valid password`;
    }
  }
  //Vérifie s'il y a des erreurs
  const result = Object.keys(errors).length === 0;

  return { result, errors };
}

//Validation de l'adresse mail
function isValidEmail(mail) {
  //Regex qui vérifie qu'il y ait x@x.x
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(mail);
}
//Validation du Password
function isValidPassword(password) {
  //Regex qui vérifie qu'il y ait 8 caractères, 1 majuscule, 1 chiffre & un caractère spécial
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}
module.exports = { checkBody };
