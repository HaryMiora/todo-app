const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Initialisation de l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('API Todo List avec authentification');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
