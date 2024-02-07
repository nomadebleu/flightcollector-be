function checkBody(body, array) {

  //Vérifie que le nom des clés correspond à ce qu'on veut
  for (const element of array) {
    console.log(`Checking ${element}: ${body[element]}`);
    if (!body[element] || body[element] === '') {
      return false;
    }

    // Validation spécifique pour le 'mail'
    if (element === 'mail' && !isValidEmail(body[element])) {
        console.log(`Failed: ${element} is not a valid email`);
        return false;
    }
  }
  return true;
}

function isValidEmail(mail) {
  //Regex qui vérifie qu'il y ait x@x.x
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(mail);
}

module.exports = { checkBody };
