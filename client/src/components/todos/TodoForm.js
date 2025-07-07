import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createTodo } from '../../services/todoService';

const TodoSchema = Yup.object().shape({
  title: Yup.string()
    .required('Le titre est requis')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  description: Yup.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
});

const TodoForm = ({ onAddTodo }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setError('');
      const newTodo = await createTodo(values);
      onAddTodo(newTodo);
      resetForm();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todo-form-container">
      <h3>Ajouter une nouvelle tâche</h3>
      {error && <div className="error-message">{error}</div>}
      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={TodoSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="todo-form">
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <Field type="text" name="title" id="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="error-text" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (optionnelle)</label>
              <Field 
                as="textarea" 
                name="description" 
                id="description" 
                className="form-control" 
                rows="3"
              />
              <ErrorMessage name="description" component="div" className="error-text" />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting || loading}
            >
              {loading ? 'Création en cours...' : 'Ajouter la tâche'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TodoForm;
