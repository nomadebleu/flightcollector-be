const mongoose = require('mongoose');

//Schéma de Badges
const badgeSchema = mongoose.Schema({
  picture: String,
  name: String,
  description: String,
  points: Number,
  flights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'flights' }],
});

//Model de Badges
const Badge = mongoose.model('badges', badgeSchema);

module.exports = Badge;
