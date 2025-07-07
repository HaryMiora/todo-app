import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .required('Mot de passe requis')
});

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setLoading(true);
      const response = await login(values);
      authLogin(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>
        {error && <div className="error-message">{error}</div>}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
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

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting || loading}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
