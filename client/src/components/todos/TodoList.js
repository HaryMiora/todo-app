import React, { useState, useEffect } from 'react';
import { getAllTodos } from '../../services/todoService';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = (newTodo) => {
    setTodos([newTodo, ...todos]);
    setShowForm(false);
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
  };

  const handleDeleteTodo = (todoId) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  if (loading) {
    return <div className="loading">Chargement des todos...</div>;
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>Mes Tâches</h2>
        <button 
          className="btn btn-add" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter une tâche'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <TodoForm onAddTodo={handleAddTodo} />
      )}

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="no-todos">Aucune tâche pour le moment. Ajoutez-en une !</p>
        ) : (
          todos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onUpdateTodo={handleUpdateTodo} 
              onDeleteTodo={handleDeleteTodo} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
