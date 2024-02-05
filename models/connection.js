require('dotenv').config();
//Pour la gestion des variables d'environnement dans .env

const mongoose = require('mongoose');
const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database Flight Collector is connected'))
  .catch((error) => console.error(error));
