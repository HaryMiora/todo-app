const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Fonction pour générer un JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si tous les champs sont remplis
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const userId = await User.create({ username, email, password });

    // Générer un token JWT
    const token = generateToken(userId);

    // Récupérer les informations de l'utilisateur sans le mot de passe
    const user = await User.findById(userId);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si tous les champs sont remplis
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = generateToken(user.id);

    // Retourner les informations de l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil' });
  }
};
