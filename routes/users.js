var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({result:true});
});



//PUT /password :Changer le password

//POST /ajouter un badge à la BADGES de user
//GET /afficher les bagde obtenus de user

module.exports = router;
