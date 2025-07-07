import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères')
    .required('Nom d\'utilisateur requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requise')
});

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setLoading(true);
      const { confirmPassword, ...userData } = values;
      const response = await register(userData);
      authLogin(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Inscription</h2>
        {error && <div className="error-message">{error}</div>}
        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <Field type="text" name="username" id="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" id="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <Field type="password" name="password" id="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <Field type="password" name="confirmPassword" id="confirmPassword" className="form-control" />
                <ErrorMessage name="confirmPassword" component="div" className="error-text" />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting || loading}
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
