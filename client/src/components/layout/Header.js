import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>TodoApp</h1>
          </Link>
          <nav className="nav">
            {isLoggedIn ? (
              <>
                <span className="welcome-text">Bienvenue, {user?.username}</span>
                <button onClick={handleLogout} className="btn btn-logout">
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-login">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-register">
                  Inscription
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
