import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { updateTodo, deleteTodo } from '../../services/todoService';

const TodoItem = ({ todo, onUpdateTodo, onDeleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
      const updatedTodo = await updateTodo(todo.id, { ...todo, status: newStatus });
      onUpdateTodo(updatedTodo);
      setError('');
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setIsEditing(false);
    setError('');
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) {
      setError('Le titre ne peut pas être vide');
      return;
    }

    try {
      setLoading(true);
      const updatedTodo = await updateTodo(todo.id, { title, description });
      onUpdateTodo(updatedTodo);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        setLoading(true);
        await deleteTodo(todo.id);
        onDeleteTodo(todo.id);
      } catch (err) {
        setError('Erreur lors de la suppression de la tâche');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`todo-item ${todo.status === 'completed' ? 'completed' : ''}`}>
      {error && <div className="error-message">{error}</div>}
      
      {isEditing ? (
        <div className="todo-edit-form">
          <div className="form-group">
            <label htmlFor={`title-${todo.id}`}>Titre</label>
            <input
              type="text"
              id={`title-${todo.id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`description-${todo.id}`}>Description</label>
            <textarea
              id={`description-${todo.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows="3"
            ></textarea>
          </div>
          <div className="todo-actions">
            <button 
              onClick={handleSaveEdit} 
              className="btn btn-save"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button 
              onClick={handleCancelEdit} 
              className="btn btn-cancel"
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <div className="todo-header">
              <h3 className="todo-title">{todo.title}</h3>
              <div className="todo-status" onClick={handleStatusToggle}>
                {todo.status === 'completed' ? (
                  <span className="status completed">Terminé</span>
                ) : (
                  <span className="status pending">En cours</span>
                )}
              </div>
            </div>
            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}
            <p className="todo-date">
              Créé le: {new Date(todo.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="todo-actions">
            <button 
              onClick={handleEdit} 
              className="btn btn-edit"
              disabled={loading}
            >
              <FaEdit /> Modifier
            </button>
            <button 
              onClick={handleDelete} 
              className="btn btn-delete"
              disabled={loading}
            >
              <FaTrash /> Supprimer
            </button>
            <button 
              onClick={handleStatusToggle} 
              className={`btn ${todo.status === 'completed' ? 'btn-incomplete' : 'btn-complete'}`}
              disabled={loading}
            >
              {todo.status === 'completed' ? (
                <><FaTimes /> Marquer comme non terminé</>
              ) : (
                <><FaCheck /> Marquer comme terminé</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
