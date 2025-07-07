const Todo = require('../models/Todo');

// Récupérer toutes les todos de l'utilisateur connecté
exports.getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const todos = await Todo.findAllByUserId(userId);
    
    res.status(200).json({ todos });
  } catch (error) {
    console.error('Erreur lors de la récupération des todos:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des todos' });
  }
};

// Récupérer une todo spécifique
exports.getTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;
    
    const todo = await Todo.findById(todoId, userId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo non trouvée' });
    }
    
    res.status(200).json({ todo });
  } catch (error) {
    console.error('Erreur lors de la récupération de la todo:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la todo' });
  }
};

// Créer une nouvelle todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    
    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }
    
    const todoId = await Todo.create({
      user_id: userId,
      title,
      description: description || ''
    });
    
    const newTodo = await Todo.findById(todoId, userId);
    
    res.status(201).json({
      message: 'Todo créée avec succès',
      todo: newTodo
    });
  } catch (error) {
    console.error('Erreur lors de la création de la todo:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la todo' });
  }
};

// Mettre à jour une todo
exports.updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;
    const { title, description, status } = req.body;
    
    // Vérifier si la todo existe
    const existingTodo = await Todo.findById(todoId, userId);
    if (!existingTodo) {
      return res.status(404).json({ message: 'Todo non trouvée' });
    }
    
    // Mettre à jour la todo
    const updated = await Todo.update(todoId, userId, {
      title: title || existingTodo.title,
      description: description !== undefined ? description : existingTodo.description,
      status: status || existingTodo.status
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Échec de la mise à jour de la todo' });
    }
    
    // Récupérer la todo mise à jour
    const updatedTodo = await Todo.findById(todoId, userId);
    
    res.status(200).json({
      message: 'Todo mise à jour avec succès',
      todo: updatedTodo
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la todo:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la todo' });
  }
};

// Supprimer une todo
exports.deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;
    
    // Vérifier si la todo existe
    const existingTodo = await Todo.findById(todoId, userId);
    if (!existingTodo) {
      return res.status(404).json({ message: 'Todo non trouvée' });
    }
    
    // Supprimer la todo
    const deleted = await Todo.delete(todoId, userId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Échec de la suppression de la todo' });
    }
    
    res.status(200).json({
      message: 'Todo supprimée avec succès',
      todoId
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la todo:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la todo' });
  }
};
